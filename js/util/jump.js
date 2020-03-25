// //获取浏览器页面可见高度和宽度  
// var _PageHeight = document.documentElement.clientHeight
// var _PageWidth = document.documentElement.clientWidth;
// //计算loading框距离顶部和左部的距离（loading框小部件的宽度为90px，高度为90px）  
// var _LoadingTop = _PageHeight > 90 ? (_PageHeight - 90) / 2 : 0,
//     _LoadingLeft = _PageWidth > 90 ? (_PageWidth - 90) / 2 : 0;
// //在页面未加载完毕之前显示的loading Html自定义内容  
// var _LoadingHtml = '<div id="loadingDiv" style="position:absolute;left:0;width:100%;height:' + _PageHeight + 'px;top:0;background:#FFFFFF;opacity:1.0;filter:alpha(opacity=80);z-index:10000;"><div class="spinner" style="position: top: 60px; margin:' + _LoadingTop + 'px auto ;"></div></div>';
// //呈现loading效果  
// document.write(_LoadingHtml);
// 
// //监听加载状态改变  
// document.onreadystatechange = completeLoading;
// 
// //加载状态为complete时移除loading效果  
// function completeLoading() {
//     if (document.readyState == "complete") {
//         //此引用了Jquery，页面没有导jq包的，需要自行加入
//         $("#loadingDiv").fadeOut(1500);
//     }
// }

//获取浏览器页面可见高度和宽度  
var _PageHeight = document.documentElement.clientHeight
var _PageWidth = document.documentElement.clientWidth;
//计算loading框距离顶部和左部的距离（loading框小部件的宽度为90px，高度为90px）  
var _LoadingTop = _PageHeight > 90 ? (_PageHeight - 90) / 2 : 0,
    _LoadingLeft = _PageWidth > 90 ? (_PageWidth - 90) / 2 : 0;
//在页面未加载完毕之前显示的loading Html自定义内容  
//var _LoadingHtml = '<div id="loadingDiv" style="position:absolute;left:0;width:100%;height:' + _PageHeight + 'px;top:0;background:#FFFFFF;opacity:1.0;filter:alpha(opacity=80);z-index:10000;"><div class="spinner" style="position: top: 60px; margin:' + _LoadingTop + 'px auto ;"></div></div>';
var _LoadingHtml = "";
	_LoadingHtml+= '<div id="loadingDiv" style="position:absolute;left:0;width:100%;height:' + _PageHeight + 'px;top:0;background:#FFFFFF;opacity:1.0;filter:alpha(opacity=80);z-index:10000;">'
				 +	'<div class="spinner" style="position: top: 60px; margin:' + _LoadingTop + 'px auto ;">'
					+	  '<div class="rect1"></div>'
					+	  '<div class="rect2"></div>'
					+	  '<div class="rect3"></div>'
					+	  '<div class="rect4"></div>'
					+	  '<div class="rect5"></div>'
				+		'</div>'
				+	'</div>';
	
			


//呈现loading效果  
document.write(_LoadingHtml);

//监听加载状态改变  
document.onreadystatechange = completeLoading;

//加载状态为complete时移除loading效果  
function completeLoading() {
    if (document.readyState == "complete") {
        //此引用了Jquery，页面没有导jq包的，需要自行加入
        $("#loadingDiv").fadeOut(700);
    }
}


