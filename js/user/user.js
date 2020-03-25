var sessionStorage = window.sessionStorage;
var token = sessionStorage.getItem("access_token");
function getUserInfo(){
	
	$.ajax({
		type:"get",
		url:baseUrl+"siteUser/info",
		headers:{
		   'Authorization':token
		},
		async:false,
		success:function(res){
			console.log(res);
			/* if(res.success  == false){
				alert(res.message);
				return;
			} */
			
			/* if(res.code == 301){
				
				window.location.href = "../../template/user/login.html"
			} */
			if (res.data != null) {
				$("#userName").val(res.data.userName)
				/* $("#password").val(res.data.password) */
				$("#area").val(res.data.area)
				$("#institute").val(res.data.institute)
				$("#organization_type").val(res.data.organization_type)
			}
			
		},
		error:function(e){
			layuiAlert("请求失败！");
		}
	})
}

getUserInfo();

function updateUser(){
	$.ajax({
		type:"get",
		url:baseUrl+"siteUser/info",
		headers:{
		   'Authorization':token
		},
		data:$('#loginContent').serialize(),
		async:true,
		success:function(res){
			console.log(res);
			if(res.success == true){
				//再查一遍
				getUserInfo();
			}
		},
		error:function(e){
			layuiAlert("请求失败！");
		}
	})
	
}
$("#confirmSubmit").click(function(){
	$.ajax({
		type:"post",
		url:baseUrl+"siteUser/update",
		headers:{
		   'Authorization':token
		},
		data:$('#loginContent').serialize(),
		async:true,
		success:function(res){
			console.log(res);
			layuiAlert(res.message);
			//if(res.success == true){
				//再查一遍
			//getUserInfo();
			//}
			
		},
		error:function(e){
			layuiAlert("请求失败！");
		}
	})
})
//检查用户是否经过PI认证
function checkUserPIState() {
	var flag = false;
	$.ajax({
		type:"get",
		url:baseUrl+"siteUser/isPassed",
		headers:{
		   'Authorization':token
		},
		async:false,
		success:function(res){
			console.log(res);
			if(res.code == 200){
				flag = true;
			}/* else{
				alert(res.message);
			} */
			
		},
		error:function(e){
			layuiAlert("请求失败！");
		}
	})
	return flag;
}

