var sessionStorage = window.sessionStorage;
var token = sessionStorage.getItem("access_token");
function addAddress(){
	$.ajax({
		type:"post",
		url:baseUrl+"address/add",
		headers:{
		   'Authorization':token
		},
		async:true,
		data:$("#addressContent").serialize(),
		success:function(res){
			if(res.flag == false){
				layuiAlert(res.message)
			}
			if(res.code == 200){
				getAddressList();
				
			}
		}
	})
}

//修改地址
function submitModify() {
	$.ajax({
		type:"post",
		url:baseUrl+"address/modify",
		headers:{
		   'Authorization':token
		},
		async:true,
		data:$("#addressContent").serialize(),
		success:function(res){
			if(res.flag == false){
				layuiAlert(res.message)
			}
			if(res.code == 200){
				getAddressList();
				
			}
		}
	})
	
}

//获取地址信息
function getDeliverAddressInfo(addressId){
	
	$.ajax({
			type:"get",
			url:baseUrl+"address/info",
			headers:{
			   'Authorization':token
			},
			async:true,
			data:{
				id:addressId
			},
			success:function(res){
				console.log(res);
				if(res.flag == false){
					layuiAlert(res.message)
				}
				
				if(res.code == 200){
					
					if(res == null){
						layuiAlert("地址信息不存在！");
						return;
					}
					//将地址信息返显到输入框
					$("#addressContent input").each(function(index){
						if (index == 0) {//name
							$(this).val(res.data.name)
						}
						if (index == 1) {//detail_address
							$(this).val(res.data.detail_address)
						}
						if (index == 2) {//telephone
							$(this).val(res.data.phone)
						}
						if (index == 3) {//id
							$(this).val(res.data.id)
						}
					})
				}
			}
	})
}

//列表查
function  getAddressList() {
	$.ajax({
		type:"get",
		url:baseUrl+"address/list",
		headers:{
		   'Authorization':token
		},
		async:true,
		data:$("#addressContent").serialize(),
		success:function(res){
			console.log(res);
			
			if(res.flag == false){
				layuiAlert(res.message)
			}
			
			if(res.code == 200){
				var dataList = res.data;
				var trs = ""
				for (var i = 0; i < dataList.length; i++) {
					var addressId = dataList[i].id
					var name = dataList[i].name
					var detail_address = dataList[i].detail_address
					var telephone = dataList[i].phone
					trs += getTrs(addressId,name,detail_address,telephone);
				}
				$("#addressTbody").html(trs);
			}
		}
	})
}

function getTrs(addressId,name,detail_address,telephone) {
	var trs = "";
	trs +=   '<tr class="thead-tbl-address address-default">'
		+		'<td style="text-align:left;">'+name+'</td>'//收货人
		+		'<td style="text-align:left;">'+detail_address+'</td>' //详细地址
		+		'<td style="text-align:left;" class="tel"">'+telephone+'</td>' //电话
		+		'<td style="text-align:left;">' //操作
		+			'<span style="margin-right: 5px;">'
		+					'<a href="javascript:getDeliverAddressInfo('+addressId+')">修改</a>'
		+			'</span>'
		+			'<span><a href="javascript:delete_address('+addressId+')">删除</a></span>'
		+		'</td>'
/* 		+		'<td>' //默认地址
		+			'<input name="status" type="radio" value="" onclick="changeStatus()">'
		+		'</td>' */
		+	'</tr>'
		
	return trs;
}
getAddressList();

function delete_address(id){
	$.ajax({
		type:"get",
		url:baseUrl+"address/delete",
		headers:{
		   'Authorization':token
		},
		async:true,
		data:{'id':id},
		success:function(res){
			console.log(res);
			if(res.flag == false){
				layuiAlert(res.message)
			}
			if(res.code == 200){
				getAddressList();
			}
		}
	})
	
}