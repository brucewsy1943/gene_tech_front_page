var sessionStorage = window.sessionStorage;
var token = sessionStorage.getItem("access_token");

function search(pageNum,pageSize){
	//看是否有经过PI认证
	var isPassedPI = checkUserPIState();
	
	if(isPassedPI){
		getOrderList(pageNum,pageSize);
	}//else{
		//alert(window.location.href)
		//var jumpUrl = sessionStorage.getItem("loginUrl");
		//if (jumpUrl != null && jumpUrl != "") {
		//	sessionStorage.removeItem("loginUrl");
		//	window.location.href = jumpUrl;
		//}else{
			//layuiAlert("您的PI认证未通过！")
			//window.history.back(-1); 
		//}
	//}
}

function getOrderList(pageNum,pageSize){
	$.ajax({
			type:"get",
			//contentType: 'application/json;charset=UTF-8',
			url:baseUrl+"order/list",
			headers:{
			   'Authorization':token
			},
			async:false,
			data:{
				'pageNum':pageNum,
				'pageSize':pageSize
			},
			success:function(res){
				console.log(res);
				if(res.code == 301){
					window.location.href = "../user/login.html";
				}
				
				if(res.data == null || res.data.list < 1){
					var noOrder = "<div style='text-align:center'><h3>暂无订单</h3></div>"
					$("#orderList").html(noOrder);
					return;
				}
				
				var orders = res.data.list
				var orderHtml = "";
				//先拼接订单
				for (var i = 0; i < orders.length; i++) {
					
					var createTime = orders[i].createTime;
					var orderNumber = orders[i].order_number;
					var orderId = orders[i].id;
					orderHtml += appendOrder (createTime,orderNumber,orderId)	
				}
				//alert(orderHtml)
				$("#orderList").html(orderHtml);
				
				//后拼接订单详情
				for (var i = 0; i < orders.length; i++) {
					var detailHtml = "";
					var orderId = orders[i].id;
					var orderDetails = orders[i].orderDetails;
					for (var j = 0; j < orderDetails.length; j++) {
						var price = orderDetails[j].money;
						//alert(price)
						var goodsNum = orderDetails[j].goods_num;
						var sumary = orderDetails[j].sumary;
						var state = orderDetails[j].orderStatus;
						
						var payImmediatlyOrClose = ""
						//订单状态 0：未付款 1：待发货 2：待收货 3：完成 4：取消
						/* if (orderDetails[j].state == 4) {
							payImmediatlyOrClose = "订单关闭"
						} else {
							payImmediatlyOrClose = "立即支付"
						} */
						var statusCode = orderDetails[j].order_status;
						//alert(statusCode)
						var goodsName = orderDetails[j].goods_name;
						var orderDetailId = "'" + orderDetails[j].id + "'";
						var productId = orderDetails[j].product_id
						detailHtml += appendOrderDetail(orderId,goodsName,price,goodsNum,sumary,state,orderDetailId,productId,statusCode)
					}
					//alert(detailHtml)
					var tagId = "#"+orderId;
					$(tagId).html(detailHtml);
				}
				var total = res.data.total;
				var pages = res.data.pages;
				var pageIndex = pageNum;
				laypage({
				   cont: "pages", //容器。值支持id名、原生dom对象，jquery对象,
				   pages: pages, //总页数
				   curr: pageIndex,//当跳转到其他页后，全局变量被修改，这边就能根据之前的页码保证刷新后依然还是之前的那一页；比如刷新前停在第二页，那么刷新后仍能保持在第二页
				   jump: function (obj, first) { //触发分页后的回调
				           if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
				               pageIndex = obj.curr;
				               Func(pageIndex, pageSize);
				       }
					}
				});
			}
		})
	
}

function appendOrder (createTime,orderNumber,orderId) {
	var orderIdInFunction = "'" + orderId + "'";
	var orderHtml = "";
		orderHtml += '<div class="ddan">'
		+'<table>' 
			+'<thead class="head">'
				+'<tr>'
					+'<td style="width:420px;text-align:left;">'
						+'<label style="margin-left: 20px;">'
							+'<span style="margin-right: 10px;font-weight: 700;">'+createTime+'</span>'
						+'</label>'
						+'<span style="color: #3c3c3c;">'
							+'<span>订单编号</span>'
							+'<span>：</span>'
							+'<span>'+orderNumber+'</span>'
							+'<span style="display:none;" class="order_id">1082</span>'
						+'</span>'
					+'</td>'
					+'<td colspan="2" style="width:100px;"></td>'
					+'<td style="width:100px;">'
						+'<div class="ww-light"><a href="../order/order_detail.html?orderId='+orderId+'"><span>订单详情</span></a></div>'
					+'</td>'
					+'<td colspan="3" style="width:460px;">'
						+'<span class="clear" onclick="delete_order('+orderIdInFunction+')" title="删除订单"></span>'
					+'</td>'
				+'</tr>'
			+'</thead>'
			+'<tbody class="main" id="'+orderId+'">'
				
			+'</tbody>'
		+'</table>'
	+'</div>'
	return orderHtml;
}

function appendOrderDetail(orderId,goodsName,price,goodsNum,sumary,state,orderDetailId,productId,statusCode){
	var detailHtml = "";
	detailHtml += '<tr>'
					+'<td>'
						+'<div style="overflow:hidden;text-align:center;">'
// 							+'<div style="float:left;width:80px;">'
// 								+'<a href="../../template/order/order_detal.html?orderId='+orderId+'" class="link" target="_bank">'
// 									//+'<img src="images/201801/goods_img/11173_G_1515738398007.jpg" alt="" style="display: block;margin: 0 auto;max-width: 100%;">'
// 								+'</a>'
// 							+'</div>'
							+'<div>'
								+'<p class="text">'
									+'<a href="../plasmid/plasmid_detail.html?id='+productId+'" class="link" target="_bank">'
										+'<span>'+goodsName+'</span>'
									+'</a>'
								+'</p>'
								/* +'<p class="text" style="color:#9c9c9c;">'
									+'<span>分享者：Simon Bullock</span>'
								+'</p>' */
							+'</div>'
						+'</div>'
					+'</td>'
					+'<td>'
						+'<div style="font-family: verdana;font-style: normal;">'
							/* +'<p style="text-decoration: line-through;margin-top: 8px;margin-bottom: 8px;line-height: 1;color:#9c9c9c;">'
								+'<span>￥</span><span>720.00</span>'
							+'</p>' */
							+'<p class="text">'
								+'<span>￥</span><span>'+price+'</span>'
							+'</p>'
						+'</div>'
					+'</td>'
					+'<td>'
						+'<div>'
							+'<p class="text">'+goodsNum+'</p>'
						+'</div>'
					+'</td>'
					+'<td>'
						+'<div>'
							+'<p class="text">'
								+'<a href="javascript:applyService()" class="link">申请售后</a>'
							+'</p>'
						+'</div>'
					+'</td>'
					+'<td style="width:100px;">'
						+'<div style="font-family: verdana;font-style: normal;">'
							+'<p class="text">'
								+'<strong>'
									+'<span>￥</span><span>'+sumary+'</span>'
								+'</strong>'
							+'</p>'
						+'</div>'
					+'</td>'
					+'<td style="width:100px;">'
					+	'<div>'
					+		'<p class="text2">'
					+			'<span style="color: #333;">'+state+'</span>'
					+		'</p>'
					+	'</div>'
					+	'<div class="link" style="margin-top:5px;">'
					if (statusCode == 4) {
						detailHtml += '<a id='+orderDetailId+' class="payOnline">'+ "订单关闭"+'</a>'
					}else{
						detailHtml += '<a id='+orderDetailId+' class="payOnline" href="javascript:payBill(this)">'+ "立即支付"+'</a>'
					}
	  
detailHtml += 		'<span class="order_amount" style="display:none;">'+sumary+'</span>'
					+	'</div>'
					+'</td>'
					+'<td style="width:100px;">'
					+	'<div>'
					+		'<p class="text2">'
					if (statusCode != 4) {
						detailHtml += '<a href="javascript:cancel_order('+orderDetailId+',4)">取消订单</a>'
					}
detailHtml +=				'</p>'
					+	'</div>'
					+	'<div>'
					+		'<p class="text2">'
					//+			'<span class="order_status" style="display:none;">未付款</span>'
					+		'</p>'
					+	'</div>'
					+'</td>'
				+'</tr>'
	return detailHtml;
}

//申请售后
function applyService(){
	layuiAlert("该模块在建设中！")
}
//删除订单
function delete_order(id){
	layuiConfirm("确定要删除吗？",delete_order_request,id);
}

function delete_order_request(id){
	$.ajax({
		type:"get",
		url:baseUrl + "order/delete",
		headers:{
		   'Authorization':token
		},
		data:{
			'id':id
		},
		async:false,
		success:function(res){
			//返回提示信息
			layuiAlert(res.message);
			//重新搜索
			search(1,10);
		}
	})
}

//取消订单
function cancel_order(orderDetailId) {
	
	layuiConfirm("确定要取消吗？",cancel_order_request,orderDetailId);
}

function cancel_order_request(orderDetailId){
	//layuiAlert(orderDetailId);
	//订单状态 0：未付款 1：待发货 2：待收货 3：完成 4：取消
	$.ajax({
		type:"post",
		url:baseUrl + "orderDetail/changeStatus",
		headers:{
		   'Authorization':token
		},
		data:{
			'orderDetailId':orderDetailId,
			'status':4
		},
		async:false,
		success:function(res){
			//返回提示信息
			if (res.code != 200) {
				layuiAlert(res.message);
			}
			//重新搜索
			search(1,10);
			
		}
	})
}

//每个order_detail付款
function payBill(){
	layuiAlert("线下支付，我们会尽快与您联系！")
	
}
search(1,10);





