//检查用户是否经过PI认证
function checkUserPIState() {
	var flag = false;
	$.ajax({
		type: "get",
		url: baseUrl + "siteUser/isPassed",
		headers: {
			'Authorization': token
		},
		async: false,
		success: function(res) {
			console.log(res);
			if (res.code == 200) {
				flag = true;
			}
		},
		error: function(e) {
			layuiAlert("请求失败！");
		}
	})
	return flag;
}

function layuiAlert(message) {
	var layer = layui.layer
	layer.open({
		title: '提示',
		content: message
	});
}
function layuiConfirm(messsage, Function,id) {
	layer.confirm(messsage, {
		btn: ['确定', '取消'] //可以无限个按钮
	},function(index) {
		//按钮【按钮二】的回调
		Function(id);
		layer.close(index);
	});
}

/* function layuiConfirm(messsage, Function) {
	layer.confirm(messsage, {
		btn: ['确定', '取消'] //可以无限个按钮
	},function(index) {
		//按钮【按钮二】的回调
		Function();	
	},function(index) {
		//按钮【按钮二】的回调
	});
} */

