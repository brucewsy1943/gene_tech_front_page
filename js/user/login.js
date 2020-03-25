//一开始加载，隐藏注册
var sessionStorage = window.sessionStorage;
$(function(){
	$("#registerContent").hide();
})
//登录
function login() {
	$.ajax({
		type:"post",
		//contentType: 'application/json;charset=UTF-8',
		url:baseUrl+"siteUser/login",
		async:true,
		data:$('#loginContent').serialize(),
		success:function(data,status,xhr){
			if(data.code == 200){
				console.log(data);
				//alert(data.message);
				//if (result != null) {
					var token = xhr.getResponseHeader("Authorization");
					sessionStorage.setItem("access_token", token);
					
					sessionStorage.setItem("loginName",data.data.userName);
					window.location.href = "../index/index.html";
				//}
			}else{
				layuiAlert(data.message);
			}
			
		},
		error:function(e){
			layuiAlert("登录失败！");
		}
	});
}
//注册
function register(){
	$.ajax({
		type:"post",
		url:baseUrl+"siteUser/register",
		async:true,
		data:$('#registerContent').serialize(),
		success:function(data){
			console.log(data);
			//暂时先跳转到登录页面
			if(data.code == 200){
				layuiAlert("注册成功！")
				window.location.href = "../user/login.html";
			}else{
				layuiAlert(data.message);
			}
		},
		error:function(e){
			layuiAlert("注册失败！");
		}
	}); 
}

function showLogin(){
	$("#loginContent").show();
	$("#registerContent").hide();
}
function showRegister(){
	$("#loginContent").hide();
	$("#registerContent").show();
}

//获取验证码
$("#img").attr("src", baseUrl + "kaptcha/getImage");
//点击验证码刷新验证码
$("#img").click(function() {
	this.src = baseUrl + 'kaptcha/getImage?d=' + new Date() * 1;
});




