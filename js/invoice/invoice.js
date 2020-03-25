
var sessionStorage = window.sessionStorage;
var token = sessionStorage.getItem("access_token");
function submitModifyInvoice(){
	$.ajax({
			type:"post",
			url:baseUrl+"invoice/modifyAdd",
			headers:{
			   'Authorization':token
			},
			async:true,
			data:$("#invoiceContent").serialize(),
			success:function(res){
				console.log(res);
				if(res.flag == false){
					layuiAlert(res.message)
				}
				
				if(res.code == 200){
					layuiAlert("修改成功！")
					getInvoiceInfo();
					
				}
			}
	})
}
getInvoiceInfo();

function getInvoiceInfo() {
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
					
					if(res.code == 200){
						
						//将信息返显到输入框
						$("#invoiceContent input").each(function(index){
							if (index == 0) {//title
							//alert($(this).val())
								$(this).val(res.data.title)
							}
							if (index == 1) {//taxpayer_number
							//alert($(this).val())
								$(this).val(res.data.taxpayer_number)
							}
							if (index == 2) {//regist_address
							//alert($(this).val())
								$(this).val(res.data.regist_address)
							}
							if (index == 3) {//regist_phone
							//alert($(this).val())
								$(this).val(res.data.regist_phone)
							}
							if (index == 4) {//open_bank
								//alert($(this).val())
								$(this).val(res.data.open_bank)
							}
							if (index == 5) {//open_account
								//alert($(this).val())
								$(this).val(res.data.open_account)
							}
							if (index == 6) {//id
								//alert($(this).val())
								$(this).val(res.data.id)
							}
						})
					}
				}
		})
	
}

$(":button").click(function(){
	submitModifyInvoice();
})