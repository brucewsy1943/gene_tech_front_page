var sessionStorage = window.sessionStorage;
var token = sessionStorage.getItem("access_token");
var layer = layui.layer
var shopplingCartList = [];

searchShoppingList(1,10);
//检索条目

//  function searchShoppingList(pageNum,pageSize){
// 	//看是否有经过PI认证
// 	var isPassedPI = checkUserPIState();
// 	
// 	if(isPassedPI){
// 		search(pageNum,pageSize);
// 	}else{
// 		//这样写有问题。假如我做登录验证，
// 		//那么显然这里还是会退回上一个页面。那么退回上一个页面和跳转到登录页哪个先完成呢？
// 		//明显是先跳到登录页，把下面这个注调就能跳了 因为先跳登录页 但是这个地方的逻辑还会继续往下走，于是又调回来了。
// 		//其他情况因为跳到了登录页，所以即使接下来有逻辑也不会影响
// 		//var url = window.location.href;
// 		//是登录，跳到登录界面
// 		//if("login".indexOf(window.location.href) != -1){
// 			//window.location.href = url;
// 		//}else{//不是登录，返回之前的页面
// 		
// 		/* if("login".indexOf(window.location.href) != -1){
// 			return;
// 		} */
// 		layer.open({
// 		  title: '提示'
// 		  ,content: "您的PI认证未通过！<span style='color: red;'>请点击我的账户进行PI认证!</span>"
// 		});  
// 		
// 	}
// } 
// 
function searchShoppingList(pageNum,pageSize) {
	$.ajax({
		type:"get",
		//contentType: 'application/json;charset=UTF-8',
		url:baseUrl+"shoppingCart/list",
		headers:{
		   'Authorization':token
		},
		async:false,
		data:{
			pageNum:pageNum,
			pageSize:pageSize
		},
		success:function(res){
			console.log(res);
			 if (res.data == null || res.data.length == 0) {
				 //假如，当前页面地址包含submit，则不跳转
				 if("submit".indexOf(window.location.href) == -1 ){
				 	window.location.href = "../shopping/shopping_cart_empty.html"
				 }
			} 
			var tr = "";
			shopplingCartList = res.data;
			var total = 0;//总计价格
			if (shopplingCartList!=null && shopplingCartList.length > 0) {
				$("#balanceCenter").show();
				for (var i = 0; i < shopplingCartList.length; i++) {
					var plasmidIdentifier = shopplingCartList[i].productCode;
					var goodsName = shopplingCartList[i].goodsName;
					var price = shopplingCartList[i].price;
					var goodsNum = shopplingCartList[i].goodsNum;
					var sumary = shopplingCartList[i].sumary;
					var goodsId = shopplingCartList[i].goodsId;
					var productId = shopplingCartList[i].productId;
					total += sumary;
					tr += getTr(plasmidIdentifier,goodsName,price,goodsNum,sumary,goodsId,productId,i+1);
				}
				
				var table = gettable(total);
				$("#formCart").html(table);
				
				$("#cartBody").html(tr);
			}else{
				//$("#formCart").height(500);
				//$("#formCart").html();
				$("#balanceCenter").hide();
			}
			
		}
	})
}

//清空购物车
function clearShoppingCart(){
	layuiConfirm("确定要清空吗？",clearShoppingCartRequest);
}

function clearShoppingCartRequest() {
	$.ajax({
				type:"get",
				//contentType: 'application/json;charset=UTF-8',
				url:baseUrl+"shoppingCart/clear",
				async:true,
				headers:{
				   'Authorization':token
				},
				success:function(res){
					console.log(res);
					
					if(res.code == 200){
						//重新请求
						searchShoppingList(1,10);
						
						$("#balanceCenter").hide();
						$("#formCart").empty()
					}else{
						layuiAlert(res.message);
					}
				}	
			});
	
}

//删除条目（单个删除）
function deleteShoppingCartItem(id) {
	layuiConfirm("确定要删除吗？",deleteShoppingCartItemRequest,id)
}

function deleteShoppingCartItemRequest(id) {
	//alert(id)
	 $.ajax({
			type:"get",
			//contentType: 'application/json;charset=UTF-8',
			url:baseUrl+"shoppingCart/delete",
			async:true,
			headers:{
			   'Authorization':token
			},
			data:{
				id:id
			},
			success:function(res){
				if (res.code == 500) {
					layuiAlert(res.message);
				}
				//简单点儿吧
				if (res.code == 200) {//删除成功
					window.location.reload()
				}
			}	
		});
}

//添加数量
function addItem(goodsId) {
	var id = "#"+goodsId;
	var goodsNum = parseInt($(id).val());
	var num = goodsNum + 1;
	$(id).val(num);
	//$(id).attr("value",num)
	//修改金额
	modifyMoney(num,id);
	modifyShoppingCart(num,goodsId);
}

function decreaseItem(goodsId){
	var id = "#"+goodsId;
	var goodsNum = parseInt($(id).val());
	var num = goodsNum - 1;
	if(num<=1){
		num = 1;
	}
	$(id).val(num);
	modifyShoppingCart(num,goodsId);
	modifyMoney(num,id);
	
}

//修改金额
function modifyMoney(goodsNum,goodsId){
	//获取到当前商品的单价和数量
	var priceTemp = $(goodsId).parent().prev().html().replace("￥","");
	//alert(priceTemp)
	var price = parseInt(priceTemp);
	
	//修改小计
	var sumary = price * goodsNum;
	//alert(sumary)
	$(goodsId).parent().next().html("￥"+sumary)
	
	//获取到所有商品的单价和数量
	//修改总计
	var total = 0;
	$("#cartBody").children().each(function(index,element){
		//alert($(this))
		$(this).children().each(function(index,element){
			//alert(element)
			 if(index == 5){
				var sumary = parseInt($(this).html().replace("￥","")) 
				total += sumary;
			} 
		}) 
	});
	//alert('total' + total)
	$("#totalPrice").html("￥"+total)
	
}

//更新购物车
function modifyShoppingCart(goodsNum,goodsId){
	$.ajax({
		type:"post",
		url:baseUrl+"shoppingCart/update",
		headers:{
		   'Authorization':token
		},
		async:true,
		data:{
			'goodsId':goodsId,
			'goodsNum':goodsNum,
			
		},
		success: function(res){
			console.log(res);
			/* window.location.href = "../../template/shopping/shop_cart_list.html" */
			if (res.code == 301) {
				layuiAlert(res.message);
			}
			
		}
	})
}

function gettable(total) {
	var table = "";
	table += '<table width="99%" class="table table-no-border table-hover quote-table">'
			+	'<thead>'
			+		'<tr>'
			+			'<th>序号</th>'
			+			'<th>质粒编号</th>'
			+			'<th>质粒名称</th>'//商品名称
			+			'<th style="text-align: center;">费用</th>'//分发费用
			+			'<th style="text-align: center;">数量</th>'//数量
			+			'<th style="text-align: center;">小计</th>'
			+			'<th style="text-align: center;">操作</th>'
/* 			+			'<th></th>' */
			+		'</tr>'
			+	'</thead>'
			+	'<tbody id="cartBody">'
			+	'</tbody>'
			+	'<tbody>'
			+		'<tr>'
			+			'<th>总计</th>'
			+			'<td></td>'
			+			'<td></td>'
			+			'<td></td>'
			+			'<td align="center" id="total_items">'
			+			'</td>'
			+			'<td id="totalPrice" align="center">￥'+total+'</td>'
			+			'<td align="right">'
			+				'<a class="btn btn-default" href="../plasmid/plasmid_list.html">继续订购</a>'
			+				'<input type="button" value="清空" class="btn btn-danger" onclick="clearShoppingCart()">'
			+			'</td>'
			+		'</tr>'
			+	'</tbody>'
			+'</table>'
			+'<input type="hidden" name="step" value="update_cart">'
		return table;
}

function getTr(plasmidIdentifier,goodsName,price,goodsNum,sumary,goodsId,productId,i){
	var tr = ""
	tr += '<tr>'
			+			'<td align="left">'
			+				i
			//+				'<input type="checkbox" class="check-box-line" data-value="11175" name="check-box-line" checked="checked">'
			+			'</td>'
			+			'<td align="left">'+plasmidIdentifier+'</td>'
			+			'<td align="left">'
			+				'<a href="../plasmid/plasmid_detail.html?id='+productId+'" target="_blank" class="f6">'+goodsName+'</a>'
			+			'</td>'
			+			'<td align="center">￥'+price+'</td>'
			+			'<td align="center">'
			+				'<a href="javascript:decreaseItem('+goodsId+')">'
			+					'<img src="../../img/bag_close.gif" border="0">'
			+				'</a>'
			+				'<input id="'+goodsId+'" type="text" value="'+goodsNum+'" size="4" class="inputBg" style="text-align:center;width: 40px;display: inline-block;" disabled="disabled">'
			+				'<a href="javascript:addItem('+goodsId+')">'
			+					'<img src="../../img/bag_open.gif" border="0">'
			+				'</a>'
	
			+			'</td>'
			+			'<td align="center">￥'+sumary+'</td>'
			+			'<td align="center">'
							/* '<a href="" class="btn btn-warning">放入收藏夹</a>' */
			+				'<a href="#" class="btn btn-default" onclick="deleteShoppingCartItem('+goodsId+')">删除</a>'
			+			'</td>'
			+		'</tr>'
	return tr;
}









