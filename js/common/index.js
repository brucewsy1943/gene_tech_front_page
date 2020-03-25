/*
 */
$(function() {
	$(window);
	// 头部搜索框方法调用
	headTab();
	tagClick();

	$('.drop-down >.tab>li.words').mouseover(function() {
		$('.tab-content .news-list').show();
		$('.tab-content .messages').hide();
		$('.drop-down >.tab>li.words').css({
			//'background':'url(/images/new-gout.png)  no-repeat',
			'background-position': '70px 0',
			'background-repeat': 'no-repeat'
		})
		$('.drop-down >.tab>li.envelope').css({
			//'background':'url(/images/xin.png)  no-repeat',
			'background-position': '64px 0',
			'background-repeat': 'no-repeat'
		})
	})

	$('.drop-down >.tab>li.envelope').mouseover(function() {
		$('.tab-content .messages').show();
		$('.tab-content .news-list').hide();
		$('.drop-down >.tab>li.envelope').css({
			//'background':'url(/images/new-xin.png)  no-repeat',
			'background-position': '64px 0',
			'background-repeat': 'no-repeat'
		})
		$('.drop-down >.tab>li.words').css({
			//'background':'url(/images/gouT.png)  no-repeat',
			'background-position': '70px 0',
			'background-repeat': 'no-repeat'
		})
	});
	// 导航
	$('.main-nav li').click(function() {
		$(this).addClass('active').siblings().removeClass('active');
	});
	//当页面滚动时搜索框固定
	$(window).scroll(function() {
		//滚动时检测页面卷曲高度和顶部的高度之间的关系
		var tHight = $("#top").height();
		var hight = $("#header").height();
		var mHight = tHight + hight;
		if ($(this).scrollTop() > mHight) {
			//卷曲高度>顶部高度，添加类名
			$("#top_header").hide();
			$("#header").addClass("header").show();
			$("#header #fixed").show();
		} else {
			$("#header").removeClass("header");
			$("#header #top_header").show();
			$("#header #fixed").hide();
		}
	});

	//    侧边栏的点击事件
	$("#sidebar p").mouseover(function() {
		$(this).siblings().animate({
			left: "-172px",
			opacity: 1
		}, 500)
	});
	$("#sidebar div.aside").mouseleave(function(e) {
		$(this).find("p").siblings().animate({
			left: "0px",
			opacity: 0
		}, 500)
	});

	$("p.TOtop").click(function() {
		$('html,body').animate({
			scrollTop: 0
		}, 500)
	});

	// 页面加载两边进入动画
	showelem('.material-left', 'fadeInLeft');
	showelem('.material-right', 'fadeInRight');
	showelem('.material-center-img', 'fadeIn');
	showelem('.ans-left-box', 'fadeInLeft');
	showelem('.ans-center', 'fadeIn');
	showelem('.ans-right-box', 'fadeInRight');
	showelem('.cloud-right', 'fadeInRight');
	showelem('.cloud-left', 'fadeInLeft');
	showelem('.school-left-box', 'fadeInLeft');
	showelem('.school-box', 'fadeInDown');
	showelem('.school-img', 'fadeInRight');


	// 锚点定位
	$("#introduce div>a").click(function() {
		var headerTop = 100;
		console.log(headerTop);
		$("html, body").animate({
			scrollTop: $($(this).attr("href")).offset().top - headerTop + "px"

		}, {
			duration: 500,
			easing: "swing"
		});
		return false;
	});


	// 导航移入显示
	$("#nav .main-nav li").mouseenter(function() {
		var index = $(this).index();
		$("#nav .navbar-dropdown .column-" + index).css('display', 'block').siblings().css('display', 'none');
	});
	$("#nav").mouseleave(function() {
		$("#nav .navbar-dropdown .navbar-dropdown-category").css('display', 'none')
	})
	//点击添加属性
	$("#nav .main-nav li").click(function() {
		$(this).addClass("active").siblings().removeClass("active");
	})
});

// 头部搜索框
function headTab() {
	$('.choose li').each(function(index) {
		$(this).on({
			'click': function() {
				$(this).addClass('visited').siblings().removeClass('visited');
				if (index == 0) {
					$("#header_form").attr('action', 'http://yqgx.yikexue.com/apparatus/lists');
					$(this).parent().next().prop('placeholder', '请输入仪器名称或单位名称');
				} else if (index == 1) {
					$("#header_form").attr('action', 'http://task.yikexue.com/service');
					$(this).parent().next().prop('placeholder', '请输入服务名称或单位名称');
				} else {
					$("#header_form").attr('action', 'http://task.yikexue.com/demand/lists');
					$(this).parent().next().prop('placeholder', '请输入检索关键词');
				}
			}
		});
	});
}

function tagClick() {
	$('.ser_pull li').on('click', function() {
		var tag = $(this).html();
		// $(this).parent().css('display','none');
		$(this).parent().siblings('.search_tag').html(tag);
		if (tag == '仪器') {
			$(".search_form_2").attr('action', 'http://yqgx.yikexue.com/apparatus/lists');
			$(this).parent().next().prop('placeholder', '请输入仪器名称或单位名称');
		} else if (tag == '服务') {
			$(".search_form_2").attr('action', 'http://task.yikexue.com/service');
			$(this).parent().next().prop('placeholder', '请输入服务名称或单位名称');
		} else {
			$(".search_form_2").attr('action', 'http://task.yikexue.com/demand/lists');
			$(this).parent().next().prop('placeholder', '请输入检索关键词');
		}

		// $('.search_tag').onmouseenter( function ( ) {
		//     $(this).siblings('ser_pull').css('display','block');
		// })

	});
}

function showelem(className, action) {
	//滚动半屏
	var halfHeight = 0.9 * $(window).height();
	///当前元素距离页面顶部的高度
	$(className).each(function(n, i) {
		var offset_top = $(this).offset().top - halfHeight;
		var a = $(this);
		$(document).on("scroll", function() {
			var scroll_top = $(this).scrollTop();
			if (scroll_top >= offset_top) {
				a.addClass("animated " + action).removeClass("opacity");
			}
		});
	});
}


jQuery(".qunar").slide({
	mainCell: ".e_pic_wrap ul",
	effect: "leftLoop",
	autoPlay: true,
	delayTime: 400
});

$(".issue_demand").mouseover(function() {
	$(".drop_down").css({
		"display": "block"
	})
})
$(".issue_demand").mouseout(function() {
	$(".drop_down").css({
		"display": "none"
	})
})
var url = window.location.href;
var Str = url.indexOf("http://jiyin.org/user.php?act=share_detial");
var Str2 = url.indexOf("http://jiyin.org/user.php?act=shared_plasmid");
if (Str == 0 && Str2 == 0) {} else if (Str == -1 && Str2 == -1) {
	delCookie("share");
	delCookie("id");
}
// if(window.location.href != "http://jiyin.org/user.php?act=shared_plasmid"&&window.location.href != "http://jiyin.org/user.php?act=share_detial"){
//           delCookie("share");
//           delCookie("id");
// }

function comingSoon() {
	layer.alert('很抱歉该库/商城暂未开放敬请期待', {
		skin: 'layui-layer-lan',
		closeBtn: 0,
		anim: 4 //动画类型
	});
}

$(function() {
	//alert(1)
	$('#hd').load('components/header.html');
	$('#ft').load('components/footer.html');
})

//<![CDATA[
var tips;
var theTop = 120 /*这是默认高度,越大越往下*/ ;
var old = theTop;

function initFloatTips() {
	tips = document.getElementById('divQQbox');
	moveTips();
};

function moveTips() {
	var tt = 50;
	if (window.innerHeight) {
		pos = window.pageYOffset
	} else if (document.documentElement && document.documentElement.scrollTop) {
		pos = document.documentElement.scrollTop
	} else if (document.body) {
		pos = document.body.scrollTop;
	}
	pos = pos - tips.offsetTop + theTop;
	pos = tips.offsetTop + pos / 10;
	if (pos < theTop) pos = theTop;
	if (pos != old) {
		tips.style.top = pos + "px";
		tt = 10;
		//alert(tips.style.top);
	}
	old = pos;
	setTimeout(moveTips, tt);
}
//!]]>
initFloatTips();

function OnlineOver() {
	document.getElementById("divMenu").style.display = "none";
	document.getElementById("divOnline").style.display = "block";
	document.getElementById("divQQbox").style.width = "170px";
}

function OnlineOut() {
	document.getElementById("divMenu").style.display = "block";
	document.getElementById("divOnline").style.display = "none";
}
if (typeof(HTMLElement) != "undefined") //给firefox定义contains()方法，ie下不起作用
{
	HTMLElement.prototype.contains = function(obj) {
		while (obj != null && typeof(obj.tagName) != "undefind") { //通过循环对比来判断是不是obj的父元素
			if (obj == this) return true;
			obj = obj.parentNode;
		}
		return false;
	};
}

function hideMsgBox(theEvent) { //theEvent用来传入事件，Firefox的方式
	if (theEvent) {
		var browser = navigator.userAgent; //取得浏览器属性
		if (browser.indexOf("Firefox") > 0) { //如果是Firefox
			if (document.getElementById('divOnline').contains(theEvent.relatedTarget)) { //如果是子元素
				return; //结束函式
			}
		}
		if (browser.indexOf("MSIE") > 0) { //如果是IE
			if (document.getElementById('divOnline').contains(event.toElement)) { //如果是子元素
				return; //结束函式
			}
		}
	}
	/*要执行的操作*/
	document.getElementById("divMenu").style.display = "block";
	document.getElementById("divOnline").style.display = "none";
}
