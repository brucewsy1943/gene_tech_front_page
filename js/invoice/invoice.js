var sessionStorage = window.sessionStorage;
var token = sessionStorage.getItem("access_token");
function submitModifyInvoice(){
	var transData = $("#invoiceContent").serialize();
	console.log(transData)
	//判断传递参数是否为空
	if($("#title").val() == "" || $("#title").val() == null){
		layuiAlert("发票抬头不能为空！");
		return
	}
	if($("#taxpayer_number").val() == "" || $("#taxpayer_number").val() == null){
		layuiAlert("纳税人识别号不能为空！")
		return
	}
	
	//假如是专票
	if($("#isProfessionalInvoiceNeeded").prop("checked")){
		if($("#regist_address").val() == "" || $("#regist_address").val() == null){
			layuiAlert("注册地址不能为空！")
			return
		}
		if($("#regist_phone").val() == "" || $("#regist_phone").val() == null){
			layuiAlert("注册电话不能为空！")
			return
		}
		if($("#open_bank").val() == "" || $("#open_bank").val() == null){
			layuiAlert("开户银行不能为空！")
			return
		}
		if($("#open_account").val() == "" || $("#open_account").val() == null){
			layuiAlert("开户账号不能为空！")
			return
		}
	}
	
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
								$(this).val(res.data.title)
							}
							if (index == 1) {//taxpayer_number
								$(this).val(res.data.taxpayer_number)
							}
							//跳开index=2---这个是checkbox
							
							if (index == 3) {//regist_address
								$(this).val(res.data.regist_address)
							}
							if (index == 4) {//regist_phone
								$(this).val(res.data.regist_phone)
							}
							if (index == 5) {//open_bank
								$(this).val(res.data.open_bank)
							}
							if (index == 6) {//open_account
								$(this).val(res.data.open_account)
							}
							if (index == 7) {//id
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

//是否显示专业开票
$("#isProfessionalInvoiceNeeded").click(function(){
	if($("#isProfessionalInvoiceNeeded").prop("checked")){
		//显示专票选项
		$("#invoiceContent").find("table").find("tbody tr:gt(2)").show();
	}else{
		$("#invoiceContent").find("table").find("tbody tr:gt(2)").hide();
	}
	//最后一个按钮留着
	$("#submitButton").show();
})



	