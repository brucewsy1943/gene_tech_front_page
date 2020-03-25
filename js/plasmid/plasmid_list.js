
var sessionStorage = window.sessionStorage;
var token = sessionStorage.getItem("access_token");
var keywordForSearch = sessionStorage.getItem("keywords");
/* if (window.location.href !=null && window.location.href!=""&& window.location.href!=undefined) {
	if(window.location.href.split("?")[1] != null && window.location.href.split("?")[1] != undefined){
		keywordForSearch = window.location.href.split("?")[1].split("=")[1];
	}
} */

//获取过滤条件
function getFilters(){
	
	$.ajax({
		type:"get",
		//contentType: 'application/json;charset=UTF-8',
		url:baseUrl+"plasmid/conditions",
		headers:{
		   'Authorization':token
		},
		async:false,
		success:function(res){
			console.log(res);
			var head = "";
			head += '<div class="search-left-title">'
				 +		'过滤器'
				 //+		'<small id="clear-all-filters" class="btn btn-default btn-xs">清除所有</small>'
				 +	'</div>'
			$("#expression-filter-section").html(head);
			
			//JQuery迭代map集合
			$.each(res.data,function(k,v){
				//alert(v)
				//一级-----第一级的分类 如plsamid_type
				$("#expression-filter-section").append(appendToggleTitle(k));
				var id = "#" + k;
				//二级------checkbox 具体的如plsamid_type的内容
				$(id).html(appendToggleContent(v,k));
				
				//三级----每个other下面的部分
				var otherId = "#" + k + "_other"
				$(id).append(appendOtherToggleTitle(k))
				
				//需要拿到other的content
				if (v != null && v.length >0) {
					for (var i = 0; i < v.length; i++) {
						if (v[i].name == "other") {
							var secondArrays = v[i].values
							var secondName = v[i].name
							$(otherId).html(appendOtherToggleContent(k,secondArrays,secondName));
							break;
						}
						
					}
				}
            });
		},
		error:function(e){
			layuiConfirm("请求失败！");
		}
	});
}
getFilters();

//第一级的标题
function appendToggleTitle(firstKey){
	var tagName = "";
	tagName += '<div class="panel-heading">'
			+	'<div class="row row-vertically-centered">'
			+		'<h4 class="panel-title">'
			+			'<span>&nbsp&nbsp</span>'
			+			firstKey
			+		'</h4>'
			+	'</div>'
			+  '</div>'
			+ '<div id="'+firstKey+'" class="collapse in panel-body"></div>'
	$("#expression-filter-section").append(tagName);
}

//第二级 也就是第一级的内容
function appendToggleContent(firstArrays,firstKey){
	
	var html = "";
	for(i=0;i<firstArrays.length;i++){
		if(firstArrays[i].name == "other"){
			continue;
		}
		
		var id = firstKey;
		html += '<div class="checkbox">'
			 +			'<input style="margin-left:0" type="checkbox" name="'+firstKey+'" class="facet" value="'+firstArrays[i].name+'" data-name="109">'
			 +		'<label>'
			 +			firstArrays[i].name
			 +		'</label>'
			 +	'</div>';
	}
	return html;
}

function appendOtherToggleContent(firstKey,secondArrays,secondKey){
	var html = "";
	for(i=0;i<secondArrays.length;i++){
		if(secondArrays[i].name == "other"){
			continue;
		}
		
		html += '<div class="checkbox">'
			 +			'<input style="margin-left:0" type="checkbox" name="'+firstKey + '_'+secondKey+'" class="facet" value="'+secondArrays[i]+'" data-name="109">'
			 +		'<label>'
			 +			secondArrays[i]
			 +		'</label>'
			 +	'</div>';
	}
	return html;
}

//others的内容的拼接
function appendOtherToggleTitle(firstKey){
	//拼接到不同的div
	var html = "";
		//假如是other，不用checkbox 用taggle
			html += '<div class="panel-heading">'
					+	'<div class="row row-vertically-centered">'
					+		'<h4 class="panel-title" data-toggle="collapse" data-target="#'+firstKey+'_other">'
					+			'<span class="caret"></span>other'
					+		'</h4>'
					+	'</div>'
					+  '</div>'
					+ '<div id="'+firstKey+'_other" class="collapse panel-body"></div>'
	return html;
}

function getCheckedValues(id){
	var targetId = "#" + id;
	var result = "";
	var selector = "input[name='"+id+"']"
	  $.each($(selector),function(){
	 		if(this.checked){
				result += $(this).val().replace(/(\s*$)/g,"") + ",";//去除最后的空格
	 		}
	 });
	 //alert(result)
	return result;
}

//搜索
function search(pageNum,pageSize,keyword) {
	var plasmid_type = getCheckedValues("plasmid_type");
	var plasmid_type_other = getCheckedValues("plasmid_type_other")
	
	var growth_bacterial_resistance = getCheckedValues("growth_bacterial_resistance")
	var growth_bacterial_resistance_other = getCheckedValues("growth_bacterial_resistance_other")
	
	var gene_species = getCheckedValues("gene_species")
	var gene_species_other = getCheckedValues("gene_species_other")
	
	var plasmid_description = getCheckedValues("plasmid_description")
	var plasmid_description_other = getCheckedValues("plasmid_description_other")
	var column_name1 = $("#firstSelector").find("option:selected").val();
	var column_value1 = $("#firstInput").val();
	
	//var keyword = $("#firstInput").val();
	
	
	//根据fuzzy——search来判定是模糊查还是按照字段查
	if(column_name1 == "fuzzy_search"){
		column_value1 = "";
	}
// 	else{//按字段查，则keyword失效
// 		keyword = "";
// 	}
	
	
	
	//条件
	var transdata = {
		"pageNum":pageNum,
		"pageSize":pageSize,
		"keyword":keyword,
		'plasmid_type':plasmid_type + plasmid_type_other,
		'growth_bacterial_resistance':growth_bacterial_resistance + growth_bacterial_resistance_other,
		'gene_species':gene_species + gene_species_other,
		'plasmid_description':plasmid_description + plasmid_description_other,
		'column_name1':column_name1,
		//'column_name2':column_name2,
		//'column_name3':column_name3,
		'column_value1':column_value1,
		//'column_value2':column_value2,
		//'column_value3':column_value3
	}
	$.ajax({
			type:"post",
			//contentType: 'application/json;charset=UTF-8',
			url:baseUrl+"plasmid/list",
			headers:{
			   'Authorization':token
			},
			async:false,
			data:transdata,
			success:function(res){
				console.log(res);
				//总条数
				$("#totalRecords").html(res.data.total);
				var html="";
				var dataList = res.data.list;
				for(i=0;i<dataList.length;i++){
					var plasmid_name = dataList[i].plasmid_name == ""||dataList[i].plasmid_name ==null?"暂无":dataList[i].plasmid_name;
					var content = plasmid_name + "&nbsp&nbsp(CCRB#  " + dataList[i].plasmid_identification + ")"
					
					var gene_identification = dataList[i].gene_identification == ""||dataList[i].gene_identification ==null?"暂无":dataList[i].gene_identification;
					var vector_type = dataList[i].vector_type == ""||dataList[i].vector_type ==null?"暂无":dataList[i].vector_type;
					var gene_name = dataList[i].gene_name == ""||dataList[i].gene_name ==null?"":dataList[i].gene_name; //a
					var gene_tag = dataList[i].gene_tag == ""||dataList[i].gene_tag ==null?"暂无":dataList[i].gene_tag;
					var gene_alias = dataList[i].gene_alias == ""||dataList[i].gene_alias ==null?"暂无":dataList[i].gene_alias;
					var gene_mutation = dataList[i].gene_mutation == ""||dataList[i].gene_mutation ==null?"":dataList[i].gene_mutation;//b
					var remark = dataList[i].remark == ""||dataList[i].remark ==null?"暂无":dataList[i].remark;
					var gene_species = dataList[i].gene_species == ""||dataList[i].gene_species ==null?"":dataList[i].gene_species;//c
					var plasmid_user_restriction = dataList[i].plasmid_user_restriction== ""||dataList[i].plasmid_user_restriction ==null?"暂无":dataList[i].plasmid_user_restriction;
					var plasmid_type = dataList[i].plasmid_type == ""||dataList[i].plasmid_type ==null?"暂无":dataList[i].plasmid_type;
					var plasmid_description  = dataList[i].plasmid_description == ""||dataList[i].plasmid_description ==null?"暂无":dataList[i].plasmid_description;
					
					html += '<ul class="clearfix bgcolor list-group-item">'+
								'<li class="search-title">'+
									'<a href="plasmid_detail.html?id='+dataList[i].id+'">'+content+'</a>'+
									'<li class="search-contant" style="width:50%">'+
										'<div class="search-result-plasmid">'+
											'<div>'+
												'<div class="col-xs-6">'+
													'插入:' + gene_name + '&nbsp'+gene_mutation + '&nbsp' + gene_species + //a+b+c
												'</div>'+
												 '<div class="col-xs-6">'+
													'质粒类型:' + plasmid_type +
												'</div>'+ 
												
											'</div>'+
											'<div style="margin-left:0">'+
												'<div class="col-xs-6">'+
													'标签:' + gene_tag +
												'</div>'+
												'<div class="col-xs-6">'+
													'质粒用途:' + plasmid_description +
												'</div>'+
											'</div>'+
										'</div>'+
									'</li>'+
								'</li>'+
							'</ul>';
								
				}
				$("#goods").html(html);
				
				//分页部分
				var total = res.data.total;
				var pages = res.data.pages;
				var pageIndex = pageNum;
				laypage({
				   cont: "pages", //容器。值支持id名、原生dom对象，jquery对象,
				   pages: pages, //总页数
				   curr: pageIndex,//当跳转到其他页后，全局变量被修改，这边就能根据之前的页码保证刷新后依然还是之前的那一页；比如刷新前停在第二页，那么刷新后仍能保持在第二页
				   jump: function (obj, first) { //触发分页后的回调
				           if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
				               pageIndex = obj.curr;
				               search(pageIndex, pageSize,keyword);
				       }
					}
				});
				//清空一下搜索条件
				//keywordForSearch = "";
			},
			error:function(e){
				layuiConfirm("请求失败！");
			}
		});
}

topSearch();

//为所有的checkbox的div添加点击事件
//选中所有的----这样写，不能为input框加上点击事件！
$(":checkbox").parent().click(function(){
	/* alert($(this).attr('class')) */
	//alert($(this).children(":first").val());
	if($(this).children(":first").is(':checked')){
		$(this).children(":first").prop("checked", false);
	}else{
		$(this).children(":first").prop("checked", true);
	}
	conditionSearch()
})
//还需要单独给checkbox加上点击事件才行！
$(":checkbox").click(function(){
	/* alert($(this).attr('class')) */
	//alert($(this).children(":first").val());
	if($(this).is(':checked')){
		$(this).prop("checked", false);
	}else{
		$(this).prop("checked", true);
	}
	conditionSearch()
})

//根据不同的按钮点击，判断是模糊查还是进阶查
//监听直到页面加载完成再添加点击事件
/* $("hd").load(function () {
	$("#search_submit_id_1").click(function(){
		
		
	})
}) */
//头部搜索框点击搜索
function topSearch(){
	search(1,10,keywordForSearch);
}

//详细搜索框点击搜索
function advancedSearch(){
	var keyword = $("#firstInput").val();
	search(1,10,keyword);
}

//过滤器点击时候的搜索
function conditionSearch(){
	var keyword = $("#firstInput").val();
	var keywordInAdvancedSearch = $("#firstInput").val();
	var keywordInTopSearch = keywordForSearch;
	if (keywordInAdvancedSearch == "" || keywordInAdvancedSearch == null) {
		if (keywordInTopSearch !=null && keywordInTopSearch != "") {
			keyword = keywordInTopSearch
		}
		
	}
	//alert(keyword)
	search(1,10,keyword);
}






