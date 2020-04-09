//var  baseUrl = "http://localhost:8099/";
//var baseUrl = "http://10.32.138.2/statistics_department/";
//var baseUrl = "http://127.0.0.1:8099/";
//var baseUrl = "http://localhost:8099/gene_tech/";
var baseUrl = "http://192.168.1.122:8099/gene_tech/"
//var baseUrl = "http://47.105.212.155:1234/";
//var baseUrl = "http://brics.ac.cn:9999/gene_tech/";
var sessionStorage = window.sessionStorage;
//ajax全局的拦截器
$.ajaxSetup({
	async:false,
	complete: function(XMLHttpRequest,status) {    
		// 通过XMLHttpRequest取得响应头，REDIRECT      
		var redirect = XMLHttpRequest.getResponseHeader("REDIRECT");//若HEADER中含有REDIRECT说明后端想重定向    
		//var message = XMLHttpRequest.getResponseHeader("MESSAGE");
		//alert('redirect'+redirect);
		if (redirect == "REDIRECT") {  
			//alert('请登录');
			//layuiAlert('请登录')
			var win = window;      
			while (win != win.top){    
				win = win.top;    
			}  
			var jumpUrl = XMLHttpRequest.getResponseHeader("CONTEXTPATH");
			sessionStorage.setItem("loginUrl",jumpUrl)
			win.location.href= jumpUrl;
		}
		//认证成功的话，每次都把登录信息存起来
		
		//PI如果认证不通过 原地刷新
		/* if(redirect == 'NOTPASS'){
			if(message!=null && message != undefined && message!=null){
				alert(message)
			}
			window.location.reload();
		} */
		
	}
});





