var orderId= window.location.href.split("?")[1].split("=")[1];
var sessionStorage = window.sessionStorage;
var token = sessionStorage.getItem("access_token")
function getOrderDetails(){
	$.ajax({
		type:"get",
		//contentType: 'application/json;charset=UTF-8',
		url:baseUrl+"order/info",
		headers:{
		   'Authorization':token
		},
		async:true,
		data:{
			id:orderId
		},
		success:function(res){
			console.log(res);
			var orderDetails = res.data.orderDetails;
			var deliveryAddress = res.data.deliveryAddressDto;
			var items = ""
			var totalPrice = 0;
			for (var i = 0; i < orderDetails.length; i++) {
				var goodsName = orderDetails[i].goods_name;
				var goodsNum = orderDetails[i].goods_num;
				var price = orderDetails[i].sumary;
				var pay_type = orderDetails[i].pay_type;
				var orderStatus = orderDetails[i].orderStatus;
				var productCode = orderDetails[i].productCode;
				totalPrice += price
				items += getItems(productCode,goodsName,price,goodsNum,orderStatus,i+1);
			}
			$("#detailItems").html(items);
			
			var addrContent = "收货地址:  " + deliveryAddress.detail_address;
			$("#addressDetail").html(addrContent);
			
			var orderNumberContent = "订单编号:  " + res.data.order_number;
			$("#orderNum").html(orderNumberContent);
			
			var messageContent = res.data.remark == null?"":res.data.remark
			$("#message").html("买家留言:  " + messageContent);
			$("#totalPrice").html("￥"+totalPrice);
		}
	})
}
getOrderDetails();
//获取商品详情目录
//后期要改。因为goods有不同品种 现在这里写死了是质粒
function getItems(productCode,goodsName,price,goodsNum,orderStatus,i){
	var items = "";
	items   +=			'<tr>'
			+				'<td>' + i
			+				'</td>'
			+				'<td>' + productCode
			+				'</td>'
			+				'<td>' + goodsName
			+				'</td>'
			+				'<td>￥' + price
			+				'</td>'
			+				'<td>'+goodsNum+'</td>'
			+				'<td>' + orderStatus
			+				'</td>'
			+			'</tr>'
	return items;
}
