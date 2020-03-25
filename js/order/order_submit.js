var sessionStorage = window.sessionStorage;
var token = sessionStorage.getItem("access_token");
pay();

function pay(){
	//接收参数
	var item = JSON.parse(localStorage.getItem("item"))// #########  localStorage读取  JSON 
	$("#orderId").html(item.orderId);
	$("#addressDetail").html(item.addressDetail);
	$("#payType").html(item.pay_type);//支付类型
	$("#invoiceType").html();//发票类型  未开票/开票
	$("#invoiceTitle").html(item.title);//抬头
	$("#taxNumber").html(item.taxpayer_number);//税号
	$("#shouldPay").html(item.total);
	$("#remark").html(item.remark)
	
}
//清除购物车
//订单生成之后，清空购物车
clearCart();
function clearCart(){
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
					//alert("清除成功！");
				}
			}	
		});
}
