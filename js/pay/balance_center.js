var sessionStorage = window.sessionStorage;
var token = sessionStorage.getItem("access_token");
//获取购物车
function getShoppingCart(pageNum,pageSize){
	$.ajax({
		type:"get",
		//contentType: 'application/json;charset=UTF-8',
		url:baseUrl+"shoppingCart/list",
		headers:{
		   'Authorization':token
		},
		async:true,
		data:{
			pageNum:pageNum,
			pageSize:pageSize
		},
		success:function(res){
			console.log(res);
			var goodstbody = "";
			var goodsthead = "";
			var getgoodstotal = ""
			var shopplingCartList = res.data;
			var total = 0;//总计价格
			if (shopplingCartList!=null && shopplingCartList.length > 0) {
				$("#balanceCenter").show();
				for (var i = 0; i < shopplingCartList.length; i++) {
					var plasmidIdentifier = shopplingCartList[i].productCode;
					var goodsName = shopplingCartList[i].goodsName;
					var price = shopplingCartList[i].price;
					var goodsNum = shopplingCartList[i].goodsNum;
					var sumary = shopplingCartList[i].sumary;
					//var plasmidId = shopplingCartList[i].plasmidId;
					var productId = shopplingCartList[i].productId;
					total += sumary;
					//购物车表格体部分
					goodstbody += getGoodsTbody(plasmidIdentifier,goodsName,goodsNum,price,sumary,i+1,productId)
				}
				//alert(goodstbody);
				//表格头
				goodsthead = getGoodsThead();
				//alert(goodsthead);
				//总计
				getgoodstotal = getGoodsTotal(total);
				var table = goodsthead + goodstbody + getgoodstotal
				//alert(table)
				$("#cartInfoTable").html(table);
				//费用统计
				$("#totalFee").html("￥"+total);
				$("#shouldPay").html("￥"+total);
			}else{
				//$("#formCart").height(500);
				//$("#formCart").html();
				$("#balanceCenter").hide();
			}			
		}
	})
}
getShoppingCart(1,20);
//获取用户的地址
function getAddress() {
		$.ajax({
			type:"get",
			//contentType: 'application/json;charset=UTF-8',
			url:baseUrl+"address/list",
			headers:{
			   'Authorization':token
			},
			async:true,
			success:function(res){
				console.log(res);
				var addressList = res.data;
				var addressBody = "";
				if(addressList!=null && addressList.length>0){
					for (var i = 0; i < addressList.length; i++) {
						var address = addressList[i].detail_address;
						var phone = addressList[i].phone;
						var addressId = addressList[i].id;
						addressBody += getAddresses(address,phone,addressId);
					}
					//addressBody += '<div style="margin-top:5px;"><a class="newAddrBtn" href="javascript:;" onclick="consignee_changes(0)">使用新地址</a></div>'
					
					$("#addresses").append(addressBody);
					
				}
				var newAddr = ""
				newAddr +='<div style="margin-top:5px;">'
						+			'<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">使用新地址</button>'
						+		'</div>'
				$("#addresses").append(newAddr);
				
			}
	})
}
getAddress();
//提交订单
function addOrder(){
	//支付方式
	var pay_type = $("input[name='payment']:checked").val();;
	//发票
	var title = $("#Taxpayer input:first-child").val();//发票抬头
	//alert("title" + title);
	var taxpayer_number=$("#Taxpayer input:eq(1)").val()//纳税人识别号
	//alert("taxpayer_number" + taxpayer_number);
	var remark = $("#postscript").val()//留言
	//alert("remark" + remark);
	//获取参数
	//地址
	var address_id = $("input[name='addressId']:checked").val();
	if(address_id == "" || address_id == null || address_id=="undefined"){
		layuiAlert("请选择一个地址！");
		return;
	}
	var params = {};
	if($("#isInvoiceNeeded").prop("checked")){//选中则发票信息必填且要往后传
		var title = $("#title").val();
		if(title == "" || title == null || title=="undefined"){
			layuiAlert("发票抬头不能为空！");
			return;
		}
		
		var taxpayer_number = $("#taxpayer_number").val();
		if(taxpayer_number == "" || taxpayer_number == null || taxpayer_number=="undefined"){
			layuiAlert("纳税人识别号不能为空！");
			return;
		}
		params = {
			'address_id':address_id,
			'title':title,
			'taxpayer_number':taxpayer_number,
			'remark':remark,
			'is_invoice_needed':1
		}
	}else{
		var params = {
			'address_id':address_id,
			'remark':remark
		}
	}
	
		$.ajax({
			type:"post",
			//contentType: 'application/json;charset=UTF-8',
			url:baseUrl+"order/addOrder",
			headers:{
			   'Authorization':token
			},
			async:true,
			data:params,
			success:function(res){
				console.log(res);
				//发生错误，不能往后走
				if(res.success == false){
					layuiAlert(res.message);
					return;
				}
				
				//订单
				var orderId = res.data;
				//地址
				var addressId = $("input[name='addressId']:checked").val();
				var addressDetailId = "#" + addressId;
				var addressDetail = $(addressDetailId).html();
				//支付方式
				var pay_type = $("input[name='payment']:checked").next().html();
				//发票
				var title = $("#Taxpayer input:first-child").val();//发票抬头
				var taxpayer_number=$("#Taxpayer input:nth-child(2)").val()//纳税人识别号
				var content = $("#Taxpayer select:last-child").val()//发票内容
				var total = $("#totalFee").html()
				var item = {
						orderId:orderId,
						addressDetail: addressDetail,
						pay_type: pay_type,
						title:title,
						taxpayer_number: taxpayer_number,
						content:content,
						total:total,
						remark:remark
					}
				 
					// ##############   localStorage 存储
					localStorage.setItem("item", JSON.stringify(item))
					
					// #############  url后传递json
					window.location.href = "../order/order_submit.html?item=" + escape(JSON.stringify(item))
			}
	})
}

//
function getGoodsThead(){
	var thead = "";
	thead+= '<thead>'
		+'<tr>'
		+	'<th>序号</th>'
		+	'<th>质粒编号</th>'
		+	'<th>质粒名称</th>'
		+	'<th style="text-align:center">数量</th>'
		+	'<th style="text-align:center">费用</th>'
		+	'<th style="text-align:right">小计</th>'
		+'</tr>'
		+'</thead>'
		return thead;
}

function getGoodsTbody(plasmidIdentifier,goodsName,goodsNum,price,sumary,i,productId) {
	var tbody = "";
	tbody += '<tbody>'
		+'<tr>'
		+	'<td>'+i+'</td>'
		+	'<td>'+plasmidIdentifier+'</td>'
		+	'<td>'
		+		'<a href="../plasmid/plasmid_detail.html?id='+productId+'" target="_blank" class="f6" style="margin-right:10px;">'+goodsName+'</a>'
		+	'</td>'
		+	'<td align="center">'+goodsNum+'</td>'
		+	'<td align="center">￥'+price+'</td>'
		+	'<td align="right">￥'+sumary+'</td>'
		+'</tr>'
	+'</tbody>'
	return tbody;
}

function  getGoodsTotal(sumary) {
	var tbody = "";
	tbody += '<tbody>'
		+'<tr>'
		+	'<th>'
		+		'小计'
		+	'</th>'
		+	'<th></th>'
		+	'<th></th>'
		+	'<th style="text-align:center" id="total">'
		+		'￥'+sumary+' </th>'
		+	'<th></th>'
		+	'<th style="text-align:right"><a class="btn btn-default" href="../shopping/shop_cart_list.html">修改</a></th>'
		+'</tr>'
		+'</tbody>'
	return tbody;
}

function getAddresses(address,phone,addressId){
	var addresses = "";
	
	addresses 	+= 		'<div style="line-height: 30px;">'
				+				'<label class="addressInfo">'
				+						'<input type="radio" name="addressId"  value="'+addressId+'">'
				+						'<span class="user-address">'
				+							'<span id="'+addressId+'">'+address+'</span>'
				+							'<em style="color: #d43f3a;font-size: 14px;font-weight: 700;font-style: normal;">'
				+								''+phone+' </em>'
				+						'</span>'
				+						'<a class="modify" href="../delivery_address/delivery_address.html" style="margin-left: 10px;">修改</a>'
				+				'</label>'
				+		'</div>'
	return addresses;
}

getInvoiceInfo();
//获取invoice的信息
function getInvoiceInfo(){
	$.ajax({
			type:"get",
			url:baseUrl+"invoice/info",
			headers:{
			   'Authorization':token
			},
			async:true,
			success:function(res){
				console.log(res);
				if(res.flag == false){
					layuiAlert(res.message)
				}
				if(res.data == null){
					return;
				}
				if(res.code == 200){
					//将信息返显到输入框
					$("#Taxpayer input").each(function(index){
						if (index == 0) {//title
						//alert($(this).val())
							$(this).val(res.data.title)
						}
						if (index == 1) {//taxpayer_number
						//alert($(this).val())
							$(this).val(res.data.taxpayer_number)
						}
						if (index == 2) {//content
						//alert($(this).val())
							$(this).val(res.data.content)
						}
					})
				}
			}
	})
}

//新增地址的时候，调用添加方法
$("#modal_submit").click(function(){
	$(this).prev().trigger("click");
	
	$.ajax({
		type:"post",
		url:baseUrl+"address/add",
		headers:{
		   'Authorization':token
		},
		async:true,
		data:$("#addressForm").serialize(),
		success:function(res){
			if(res.flag == false){
				layuiAlert(res.message)
			}
			if(res.code == 200){
				$("#addresses").empty()
				getAddress();
			} 
		}
	})
	
})

//模态框
function consignee_changes(){
	$('#exampleModal').on('show.bs.modal', function (event) {
	  var button = $(event.relatedTarget) // Button that triggered the modal
	  var recipient = button.data('whatever') // Extract info from data-* attributes
	  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
	  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
	  var modal = $(this)
	  modal.find('.modal-title').text('New message to ' + recipient)
	  modal.find('.modal-body input').val(recipient)
	})
}


$("#isInvoiceNeeded").click(function(){
	if(!$("#isInvoiceNeeded").prop("checked")){
		$("#Taxpayer").hide();
	}else{
		$("#Taxpayer").show();
	}
})
	
	/* if(!$("#isInvoiceNeeded").prop("checked")){
		$("#Taxpayer").hide();
	} */

	



