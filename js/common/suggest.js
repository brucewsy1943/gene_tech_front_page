var $$=function(node){
    //alert('this is $$ fn');
    return document.getElementById(node);
}
var $N=function(obj,node){
    //alert('this is N fn');
    return obj.getElementsByTagName(node);
}


var j=-1;
var temp_str;
function ajax_keyword(V)
{
    //alert('this is ajax_keyword fn');
	Ajax.call('search_suggest.php', 'keywords='+escape(V), search_response, "POST", "TEXT");
}

function search_response(result)
{
    //alert('this is search_response fn');
	//var res = $.parseJSON(result);修改了jqury兼容后
	var res = result.parseJSON();//没修改jqury兼容问题
	var ele = document.getElementById("search_suggest");
	if(res.content!="")
	{
		ele.innerHTML = res.content;
		$$("search_suggest").style.display="block";
	}
	else
	{
			closediv();return;
	}
}

function keyupdeal(e,V)
{
    //alert('this is keyupdeal fn');
	initdiv();
	if(temp_str==V)return;
	if(V==""){temp_str="";closediv();return;}
	var keyc;
	if(window.event){keyc=e.keyCode;}else if(e.which){keyc=e.which;}
	if(keyc==1)return;
	if(keyc!=40 && keyc!=38){ajax_keyword(V);temp_str=V;}
}

function form_submit(obj)
{
    //alert('this is form_submit fn');
	$$("keyword").value=obj.childNodes[0].firstChild.nodeValue;
	$$("searchForm").submit();
}

function keydowndeal(e)
{
//alert('this is keydowndeal fn');
var keyc;
var obj=$$("search_suggest");
if(window.event){keyc=e.keyCode;}else if(e.which){keyc=e.which;}
if(keyc==40||keyc==38)
	{
		if(keyc==40)
		{
		if(j<$N(obj,"li").length){j++;if(j>=$N(obj,"li").length){j=-1;}}
		if(j>=$N(obj,"li").length){j=-1;}
		}
		if(keyc==38)
		{
		if(j>=0){j--;if(j<=-1){j=$N(obj,"li").length;}}else{j=$N(obj,"li").length-1;}
		}	
		set_style(obj,j);
		if(j>=0&&j<$N(obj,"li").length){$$("keyword").value=$N(obj,"li")[j].childNodes[0].firstChild.nodeValue;}
		else{$$("keyword").value=temp_str;}
	}
}

function set_style(obj,num)
{
    //alert('this is set_style fn');
	for(var i=0;i<$N(obj,"li").length;i++){var li_node=$N(obj,"li")[i];li_node.className="";}
	if(j>=0 && j<$N(obj,"li").length){var i_node=$N(obj,"li")[j];$N(obj,"li")[j].className="selected";}
}
function closediv()
{
    //alert('this is closediv fn');
    document.getElementById("search_suggest").innerHTML="";
    document.getElementById("search_suggest").style.display="none";
}

function initdiv(){
    //alert('this is initdiv fn');
	var x=0,y=0; 
	p=$$("keyword");
	//alert("suggest_top"+$$("search_suggest").style.top.toString());
	//alert("suggest_left"+$$("search_suggest").style.left.toString());
	while (p)
	{  
  	x += p.offsetLeft  || 0;
  	y += p.offsetTop || 0;
  	p = p.offsetParent;
	} 
}

function suggestOver(obj)
{
        //alert('this is suggestOver fn');
	_over();
	obj.className='selected';
        
}

function suggestOut(obj)
{
        //alert('this is suggestOut fn');
	_out();
  obj.className='';
  
}

function AddEvent(a, b, c){
        //alert('this is AddEvent fn');
        !document.all ? a.addEventListener(b, c, false) : a.attachEvent("on" + b, c);

}
function DelEvent(a, b, c){
        //alert('this is DelEvent fn');
        !document.all ? a.removeEventListener(b, c, false) : a.detachEvent("on" + b, c);
        a.onblur="";
}

function _over()
{
        //alert('this is _over fn');
	DelEvent($$('keyword'), 'blur', closediv);
}

function _out()
{
        //alert(' this is _out fn');
	AddEvent($$('keyword'), 'blur', closediv);
}
window.onresize = function(){
    //alert('inidiv fn');
    /*
     *调整浏览器窗口时的 提示框 调整
     **/
    initdiv();   
}