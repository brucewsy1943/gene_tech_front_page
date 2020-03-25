var plasmidId= window.location.href.split("?")[1].split("=")[1];
var sessionStorage = window.sessionStorage;
var token = sessionStorage.getItem("access_token");

function getPlasmidDetail() {
	$.ajax({
		type:"get",
		//contentType: 'application/json;charset=UTF-8',
		url:baseUrl+"plasmid/detail",
		headers:{
		   'Authorization':token
		},
		async:true,
		data:{
			id:plasmidId
		},
		success:function(res){
			console.log(res);
			var attachmentUrls = res.data.attachmentUrls;
			//商品名
			$("#plasmidName").html(res.data.plasmid_name)
			var content = "&nbsp&nbsp(CCRB#  " + res.data.plasmid_identification + ")"
			$("#plasmid_identification").html(content)
			
			//基本信息
			$("#plasmid_type").html(res.data.plasmid_type)
			$("#plasmid_ID").html(res.data.plasmid_identification)
			var gene_insert = res.data.gene_name + '&nbsp&nbsp' +res.data.gene_species
			$("#gene_insert").html(gene_insert)//a+b
			$("#gene_mutation").html(res.data.gene_mutation)
			$("#gene_alias").html(res.data.gene_alias)
			$("#gene_identification").html(res.data.gene_identification)
			$("#gene_tag").html(res.data.gene_tag)
			$("#remark").html(rewriteRemark(res.data.remark));//如果remark里面带链接，重写
			
			//载体骨架
			$("#vector_backbone").html(res.data.vector_backbone);
			$("#growth_bacterial_resistance").html(res.data.growth_bacterial_resistance);
			$("#growth_strain").html(res.data.growth_strain);//克隆菌株
			
			$("#vector_type").html(res.data.vector_type);//用途
			$("#growth_selection_mark").html(res.data.growth_selection_mark);//筛选标记
		    $("#growth_temperature").html(res.data.growth_temperature);
			
			//商品id
			$("#goodsId").val(res.data.goods_id);
			//参考信息
			var source_article =  $("#source_article").html(res.data.source_article);
			var lab_name =  $("#lab_name").html(res.data.lab_name);
			
			if(attachmentUrls!=null && attachmentUrls.length > 0){
				var attachmentTags = ""
				for (var i = 0; i < attachmentUrls.length; i++) {
					attachmentTags += '<span class="field-label">'+getFileName(attachmentUrls[i])+'</span>&nbsp&nbsp&nbsp'
								   +  '<span class="field-label">'+'<a href="'+baseUrl+attachmentUrls[i]+'">下载预览</a>'+'</span>'
					$("#attachments").after(attachmentTags);
				}
			}
			
		},
		error:function(e){
			layuiAlert("请求失败！");
		}
	})
}
getPlasmidDetail();

//加入购物车
function addToShoppingCart(){
	//看是否有经过PI认证
	var isPassedPI = checkUserPIState();
	
	if(isPassedPI){
		addToCart();
	}else{
		layuiAlert("您的PI认证未通过！<span style='color: red;'>请点击我的账户进行PI认证!</span>");
	}
}

function addToCart(){
	if($("#goodsNumber").val() == null || $("#goodsNumber").val()==""){
		layuiAlert("商品数量不能为空！")
	}
	
	$.ajax({
		type:"post",
		//contentType: 'application/json;charset=UTF-8',
		url:baseUrl+"shoppingCart/add",
		headers:{
		   'Authorization':token
		},
		async:false,
		data:{
			goodsId:$("#goodsId").val(),
			goodsNum:$("#goodsNumber").val(),
		},
		success: function(res){
			console.log(res);
			/* window.location.href = "../../template/shopping/shop_cart_list.html" */
			if (res.code == 301) {
				layuiAlert(res.message);
			}
			if(res.code == 200){
				layuiAlert("成功加入购物车!")
			}
			
		}
		
	})
}



function getFileName(str) {
	var start = 17;
	/* while(str.indexOf("/")!= -1){
		start = str.indexOf("/");
		str.replace("/","");
	} */
	var end = str.length;
	var result = str.substring(start,end)
	
	return result;
}
//重写remark
function rewriteRemark(remark){
	if(remark.indexOf("http")!=-1){
		var start = remark.indexOf("h");
		var end = remark.length;
		var href = remark.substring(start,end);
		var other = remark.substring(0,start);
		var remarkHtml = other + "<a style='font-weight:bold'" + " href = " + href +">" + href + "</a>";
		return remarkHtml;
	}
	return remark;
}
