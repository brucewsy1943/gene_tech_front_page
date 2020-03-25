function pagenation(total,pages,pageIndex,pageSize,Func){
	laypage({
	   cont: "pages", //容器。值支持id名、原生dom对象，jquery对象,
	   pages: pages, //总页数
	   curr: pageIndex,//当跳转到其他页后，全局变量被修改，这边就能根据之前的页码保证刷新后依然还是之前的那一页；比如刷新前停在第二页，那么刷新后仍能保持在第二页
	   jump: function (obj, first) { //触发分页后的回调
	           if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
	               pageIndex = obj.curr;
	               Func(pageIndex, pageSize);
	       }
		}
	});
}
