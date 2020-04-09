var sessionStorage = window.sessionStorage;
var token = sessionStorage.getItem("access_token");
$("#piSubmit").click(function(){
	submitSupply();
})

//提交PI申请
function submitSupply(){
	//alert($('#piContent').serialize())
	$.ajax({
			type:"post",
			//contentType: 'application/json;charset=UTF-8',
			url:baseUrl+"siteUser/piSubmit",
			headers:{
			   'Authorization':token
			},
			async:true,
			data:$('#piContent').serialize(),
			success:function(res){
				console.log(res);
				if (res.code == 500) {
					layuiAlert(res.message)
				}
				
				if(res.code == 200){
					layuiAlert("提交成功")
					getPiInfo();
					checkState();
				}
			},
		error:function(e){
			layuiAlert("提交申请失败！");
		}
	});
}
//查询是否通过审核
function checkState() {
	$.ajax({
			type:"get",
			//contentType: 'application/json;charset=UTF-8',
			url:baseUrl+"siteUser/isPassed",
			headers:{
			   'Authorization':token
			},
			async:true,
			success:function(res){
				console.log(res);
				if(res.code ==301){
					layuiAlert("用户未登录！")
				}
				//alert($("#steps li:eq(0)").attr("class"))
				//查找用户信息
				getPiInfo();
				
				if(res.data == 0){//未通过
					$("#steps li:eq(1)").removeClass("active");
					$("#steps li:eq(2)").removeClass("active");
					//将未通过的div打开
					$("#notPass").show();
					$("#verifying").hide();
					$("#pass").hide();
					
					$("input[type=text]").attr("readonly",false);
				}
				
				if(res.data == 1){//审核中
					$("#steps li:eq(1)").addClass("active");
					$("#steps li:eq(2)").removeClass("active");
					
					$("#notPass").hide();
					$("#verifying").show();
					$("#pass").hide();
					
					$("#piSubmit").hide();
					$("input[type=text]").attr("readonly",true);
				}
				
				if(res.data == 2){//通过
					$("#steps li:eq(1)").addClass("active");
					$("#steps li:eq(2)").addClass("active");
					//显示所有的属性并把input设为只读
					$("#notPass").hide();
					$("#verifying").hide();
					$("#pass").show();
					$("input[type=text]").attr("readonly",true);
					
					$("#piSubmit").hide();
				}
				
				if(res.data == 3){//未验证
					$("#steps li:eq(1)").removeClass("active");
					$("#steps li:eq(2)").removeClass("active");
					//显示所有的属性并把input设为只读
					$("#notPass").hide();
					$("#verifying").hide();
					$("#pass").hide();
					$("input[type=text]").attr("readonly",false);
				}
				
			},
		error:function(e){
			layuiAlert("提交申请失败！");
		}
	});
}
checkState();

function getPiInfo(){
	/**
	 * 真实姓名wsy 							real_name
		所在机构 中科院生化细胞所苏州研究院	institute
		移动电话 13962559397					telephone
		邮箱信息 354416454@qq.com			email
		机构地址 纳米城						institute_address
		PI 姓名 喻长杰 						pi_name
		PI 电话 18976547328 					pi_phone
	 */
	
	$.ajax({
			type:"get",
			//contentType: 'application/json;charset=UTF-8',
			url:baseUrl+"siteUser/info",
			headers:{
			   'Authorization':token
			},
			async:true,
			success:function(res){
				console.log(res);
				var userInfo = res.data;
				$("#piInputs input").each(function(index){
					//alert($(this).val())
					if(index == 0){
						$(this).val(userInfo.real_name);
					}else if(index == 1){
						$(this).val(userInfo.institute);
					}else if(index == 2){
						$(this).val(userInfo.telephone);
					}else if(index == 3){
						$(this).val(userInfo.email);
					}else if(index == 4){
						$(this).val(userInfo.institute_address);
					}else if(index == 5){
						$(this).val(userInfo.pi_name);
					}else if(index == 6){
						$(this).val(userInfo.pi_email);
					}
				})
			},
		error:function(e){
			layuiAlert("提交申请失败！");
		}
	});
	
}
//getPiInfo();










