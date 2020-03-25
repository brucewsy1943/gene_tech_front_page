//点击添加质粒的js
var shareAll = [];
var aa = getCookie("share");
if(getCookie("id")){
  var id = Number(getCookie("id"));
}else{
  var id = 0;
}
function addPlasmid() {
  var frm = document.forms['add-plasmid-form'];
  var name = frm.elements['name'].value;
  var type = frm.elements['type'].value;
  var share_name = frm.elements['share_name'].value;
  var description = frm.elements['description'].value;
  var msg = "";
  if(name == ""){
    msg+="质粒名称不能为空"+"</br>";
  }
  if(type == ""){
    msg+="请选择质粒类型"+"</br>";
  }
  if(description == ""){
    msg+="质粒描述不能为空"+"</br>";
  }
  if(msg.length > 0){
    layer.alert(msg);
  }else {
    //将数据存入数据库
    Ajax.call('user.php?act=shared_insert',"&plasmid_name="+name+"&share_name="+share_name+"&plasmid_type="+type+"&plasmid_description="+description+"&Information_integrity="+"no", shareReponse, 'GET', 'TEXT');
  }
  function shareReponse(result){
    if(result == "1"){
      layer.alert("您已添加过该质粒，可以到我的质粒去查看哦");
    }else {
      id +=1;
      setCookie("id",id,3600);
      var id1 = getCookie("id");
      // var right = frm.elements['right'].value;
      // var status = frm.elements['status'].value;
      var status = '质粒信息未完善';
      var shareTemp = {};
      shareTemp.name = name;
      shareTemp.type = type;
      shareTemp.description = description;
      shareTemp.id = id1;
      // shareTemp.right = right;
      // shareTemp.status = status;
      shareTemp.status = status;
      var str = JSON.stringify(shareTemp);
      shareAll[shareAll.length]=str;
      setCookie("share",aa+shareAll+',');

      layui.use('table', function(){
          var table = layui.table;
          document.getElementById('add-new-name').value = "";
          document.getElementById('id_type').value = "";
          document.getElementById('id_description').value = "";
          table.reload('test', {
            url: '/user.php?act=shared_cookie'
          });
          // window.location.reload();
          })
    }
  }
}

function isTrue(obj,name){
  $(obj).addClass("active").siblings().removeClass("active");
  if($(obj).text() == "是"){
    $('#'+name).show()
  }else {
    $('#'+name).hide()
  };
}

function deleteData(data,name,share_id,type){
  // console.log('user.php?act=delete_file',"&share_id="+share_id+"&name="+name+"&type"+type);
  Ajax.call('user.php?act=delete_file',"&share_id="+share_id+"&name="+name+"&type="+type, deleteDataResponse, 'GET', 'TEXT');
  function deleteDataResponse(result){
    if(result == "true")
      $(data).parents("tr").remove();
    }
}
  function test(str){
      var test = str;
      var j = 0;
      for(var i = 0; i<test.length;i++){
          if(test[i] =="a"|| test[i]=="c"||test[i]=="g"||test[i]=="t"||test[i]=="A"||test[i]=="C"||test[i]=="G"||test[i]=="T"){
             j++;
          }
      }
      if(j==i){
         return true;
      }else{
        return false;
          }
  }
  function step1Next(){
    var len = $("#more-sequence>li").length;
    var len1 = $("#more-about-data>li").length;
    var seqlen = $(".sc_success").length;
    var wait_file = $(".wait_file").length;
    var frm = document.forms['plasmidStep1'];
    var share_id =  frm.elements['share_id'].value;
    var plasmid_name =  frm.elements['plasmid_name'].value;
    var plasmid_type =  frm.elements['plasmid_type'].value;
    var step1Detial = {};
    var step1Data = {};
    var step1Data1 = {};
    var step1Art = {};
    var step1Art1 = {};
    var msg = "";
    if(wait_file > 0){
        msg+="你添加的序列文件还未上传哦"+"</br>";
    }
    for(var i = 0; i<len; i++){
      step1Data["sequence-is_full"] = frm.elements['sequence-'+i+'-is_full'].value;
      step1Data["sequence-description"] = frm.elements['sequence-'+i+'-description'].value;
      step1Data["sequence-sequence"] = frm.elements['sequence-'+i+'-sequence'].value;
      step1Data["sequence-sequence"] = step1Data["sequence-sequence"].replace(/\s/g,'');
      step1Data["sequence-sequence"] = step1Data["sequence-sequence"].replace(/\d+/g,'');
      lenseq = step1Data["sequence-sequence"].replace(/(^\s*)|(\s*$)/g, "").length;
      if(seqlen == 0){
        if(step1Data["sequence-is_full"] == ""){
          msg+="质粒序列信息不能为空，请填写或上传质粒序列。"+"</br>";
          break;
        }
        if(lenseq == 0){
          msg+="序列不能为空！"+"</br>"
          break;
        }else{
          if(!test(step1Data["sequence-sequence"])){
            msg+="请填写正确的基因序列"+"</br>";
            break;
          }
        }
      }else {
        if(step1Data["sequence-is_full"] != ""||lenseq != 0){
          if(step1Data["sequence-is_full"] == ""){
            msg+="请选择全部序列/部分序列！"+"</br>";
            break;
          }
          if(lenseq == 0){
            msg+="序列不能为空！"+"</br>"
            break;
          }else{
            if(!test(step1Data["sequence-sequence"])){
              msg+="请填写正确的基因序列"+"</br>";
              break;
            }
          }
        }
      }
      step1Data1[i] = step1Data;
      step1Data = {};
    }
    step1Detial["sequence"] = step1Data1;
    for (var j = 0; j < len1; j++) {
      step1Art["about-data"] = frm.elements['about-data'+j].value;
      step1Art1[j] = step1Art;
      step1Art = {};
    }
    step1Detial["about_data"] = step1Art1;
    step1Detial["article-id"] = frm.elements['article-id'].value;
    step1Detial["article-news"] = frm.elements['article-news'].value;
    if(msg.length > 0){
      layer.alert(msg)
    }else {
      step1Detial = JSON.stringify(step1Detial);
      Ajax.call('user.php?act=step_1_save',"&step1Data="+step1Detial+"&share_id="+share_id+"&plasmid_name="+plasmid_name+"&plasmid_type="+plasmid_type, dataStep1Response, 'POST', 'JSON');
    }
  }
  function dataStep1Response(result){
    var name = result.plasmid_name;
    if(result.plasmid_type == "702"){
      window.location.href = '/user.php?act=share_detial&plasmid_name='+name+'&step=3'
    }else{
      window.location.href = '/user.php?act=share_detial&plasmid_name='+name+'&step=2'
    }

  }
  function step2Next(){
    var sectionLength = $("#step2>section").length;
    var frm = document.forms['geneStep2'];
    var share_id =  frm.elements['share_id'].value;
    var plasmid_name =  frm.elements['plasmid_name'].value;
    var step2Data = {};
    var step3DataClone = {};
    var step3Data1Clone = {};
    var step2Data1 = {};
    var step2DataTag = {};
    var step2DataTagArr = [];
    var checkID = [];//定义一个空数组
    for(var i = 0; i<sectionLength; i++){
      var tagLength = $("#fusion-protein-"+i).children("li").length;
      step2Data['insert_gene'] = frm.elements['insert_'+i+'_gene'].value;
      step3DataClone['insert_gene'] = frm.elements['insert_'+i+'_gene'].value;
      step2Data['insert_genealt1'] = frm.elements['insert_'+i+'_genealt1'].value;
      step2Data['insert_genealt2'] = frm.elements['insert_'+i+'_genealt2'].value;
      step2Data['insert_genealt3']= frm.elements['insert_'+i+'_genealt3'].value;
      step2Data['insert_insertsize'] = frm.elements['insert_'+i+'_insertsize'].value;
      step2Data['insert_genbank'] = frm.elements['insert_'+i+'_genbank'].value;
      step2Data['insert_genbank1'] = frm.elements['insert_'+i+'_genbank1'].value;
      if(frm.elements['insert_'+i+'_species_other']){
            step2Data['insert_species_other'] = frm.elements['insert_'+i+'_species_other'].value;
      }
      if(frm.elements['insert_'+i+'_mutation']){
              step2Data['insert_mutation'] = frm.elements['insert_'+i+'_mutation'].value;
      }
      for(var j=0; j<tagLength; j++){
        //console.log('insert_'+i+'_tag-'+j);
              step2DataTag['insert_tag-0'] = frm.elements['insert_'+i+'_tag-'+j].value;
              step2DataTag['insert_location-0'] = frm.elements['insert_'+i+'_location-'+j].value;
              step2DataTagArr.push(step2DataTag);
              step2DataTag = {};
      }
      step2Data['insert_tag'] = step2DataTagArr;
      step2DataTagArr = [];
      $("input[name='insert_"+i+"_species']:checked").each(function(k){//把所有被选中的复选框的值存入数组
          checkID[k] =$(this).val();
      });
      step2Data['insert_species'] = checkID;
      checkID=[];
      step2Data1[i]=step2Data;
      step3Data1Clone[i]=step3DataClone;
      //console.log(JSON.stringify(step2Data));
      step2Data ={};
      step3DataClone ={};
    }
    step2Data1 = JSON.stringify(step2Data1);
    step3Data1Clone = JSON.stringify(step3Data1Clone);
    Ajax.call('user.php?act=step_2_save',"&step2Data="+step2Data1+"&step3DataClone="+step3Data1Clone+"&share_id="+share_id+"&plasmid_name="+plasmid_name, dataResponse, 'POST', 'text');
  }
  function dataResponse(result){
    //console.log(result);
    if(result == "2"){
      layer.alert("其他物种信息不能为空!");
    }
    else if(result == "0"){
      layer.alert("插入基因序列的名称不能为空!");
    }else if(result == "1"){
      layer.alert("插入基因序列的物种来源不能为空!");
    }else{
      window.location.href = '/user.php?act=share_detial&plasmid_name='+result+'&step=3'
    }
  }
  //第三步的js
  $(".clone-method.form-control").on("change",function(){
    var li = $(this).parents("li").siblings(".gene_step3_show");
  if ($("option:selected",this).val() == '1') {
    li.css({
      display:"block"
    })
  }else {
    li.css({
      display:"none"
    })
  }
  })
  function step3Next(){
    var frm = document.forms['geneStep3'];
    var share_id =  frm.elements['share_id'].value;
    var plasmid_name =  frm.elements['plasmid_name'].value;
    var tagLength3 =  $("#fusion-protein-0>li").length;
    var cloneLength3 =  $(".step3-clone-ul").length;
    var msg = "";
    var step3Data = {};
    var step3DataClone = {};
    var step3DataTag = {};
    var step3DataTagArr = [];
    var step3DataClone = {};
    var step3DataCloneArr = [];
    var checkValue = [];//定义一个空数组
    var checkValue1 = [];//定义一个空数组
    step3Data['cloning-0-backbone'] = frm.elements['cloning-0-backbone'].value;
    step3Data['cloning-0-backbone_origin'] = frm.elements['cloning-0-backbone_origin'].value;
    if(frm.elements['cloning-0-backbone_size']){
        step3Data['cloning-0-backbone_size'] = frm.elements['cloning-0-backbone_size'].value;
    }
    step3Data['cloning-0-total_vector_size'] = frm.elements['cloning-0-total_vector_size'].value;
    step3Data['cloning-0-backbone_mutation'] = frm.elements['cloning-0-backbone_mutation'].value;
    step3Data['cloning-0-vector_type_other'] = frm.elements['cloning-0-vector_type_other'].value;
    step3Data['cloning-0-vector_type_other1'] = frm.elements['cloning-0-vector_type_other1'].value;
    //循环取出融合蛋白标签的值
    if(tagLength3>0){
      for(var j=0; j<tagLength3; j++){
        //console.log('insert_'+i+'_tag-'+j);
              step3DataTag['insert_tag-0'] = frm.elements['insert_'+j+'_tag-0'].value;
              step3DataTag['insert_location-0'] = frm.elements['insert_'+j+'_location-0'].value;
              step3DataTagArr.push(step3DataTag);
              step3DataTag = {};
      }
      step3Data['insert_tag-step3'] = step3DataTagArr;
    }
    //循环取出克隆信息的值
    if(cloneLength3>0){
      for(var n=0; n<cloneLength3; n++){
        //console.log('insert_'+i+'_tag-'+j);
            if(frm.elements['insert_'+n+'_gene']){
              step3DataClone['insert_gene'] = frm.elements['insert_'+n+'_gene'].value;
            }
              step3DataClone['insert_0_cloning-0-promoter'] = frm.elements['insert_'+n+'_cloning-0-promoter'].value;
              step3DataClone['insert_0_cloning-0-clone_method'] = frm.elements['insert_'+n+'_cloning-0-clone_method'].value;
              step3DataClone['insert_0_cloning-0-sequencing_primer_5'] = frm.elements['insert_'+n+'_cloning-0-sequencing_primer_5'].value;
              step3DataClone['insert_0_cloning-0-sequencing_primer_3'] = frm.elements['insert_'+n+'_cloning-0-sequencing_primer_3'].value;
              if(frm.elements['insert_'+n+'_cloning-0-clone_site_1']){
              step3DataClone['insert_0_cloning-0-clone_site_1'] = frm.elements['insert_'+n+'_cloning-0-clone_site_1'].value;
              }
              if(frm.elements['insert_'+n+'_cloning-0-cs_1_destroyed']){
              step3DataClone['insert_0_cloning-0-cs_1_destroyed'] = frm.elements['insert_'+n+'_cloning-0-cs_1_destroyed'].value;
              }
              if(frm.elements['insert_'+n+'_cloning-0-clone_site_2']){
              step3DataClone['insert_0_cloning-0-clone_site_2'] = frm.elements['insert_'+n+'_cloning-0-clone_site_2'].value;
              }
              if(frm.elements['insert_'+n+'_cloning-0-cs_2_destroyed']){
              step3DataClone['insert_0_cloning-0-cs_2_destroyed'] = frm.elements['insert_'+n+'_cloning-0-cs_2_destroyed'].value;
              }
              step3DataCloneArr.push(step3DataClone);
              step3DataClone = {};
      }
      step3DataClone= step3DataCloneArr;
    }
    $("input[name='cloning-0-vector_type']:checked").each(function(k){//把所有被选中的复选框的值存入数组
        checkValue[k] =$(this).val();
    });
    step3Data['insert_clone_type'] = checkValue;
    $("input[name='cloning-0-vector_type1']:checked").each(function(m){//把所有被选中的复选框的值存入数组
        checkValue1[m] =$(this).val();
    });
    step3Data['insert_clone_type1'] = checkValue1;
    if(step3Data['cloning-0-backbone'].length == 0){
      msg+="质粒骨架名称不能为空"+"</br>";
    }
    if(step3Data['cloning-0-total_vector_size'].length == 0){
      msg+="质粒大小不能为空"+"</br>";
    }
    if(step3Data['insert_clone_type'].length == 0){
      msg+="请选择表达系统"+"</br>";
    }
    if(step3Data['insert_clone_type1'].length == 0){
      msg+="请选择质粒的功能/用途"+"</br>";
    }
    if($.inArray("9", step3Data['insert_clone_type'])!=-1){
      if(step3Data['cloning-0-vector_type_other1'].length == 0){
        msg+="其他表达系统不能为空"+"</br>";
      }
    }
    if($.inArray("28", step3Data['insert_clone_type1'])!=-1){
      if(step3Data['cloning-0-vector_type_other'].length == 0){
        msg+="其他质粒功能/用途不能为空"+"</br>";
      }
    }
    for(var i=0; i<step3DataClone.length; i++){
      if(step3DataClone[i]['insert_0_cloning-0-promoter'].length == 0){
        msg+="启动子不能为空"+"</br>";
        break;
      }
      if(step3DataClone[i]['insert_0_cloning-0-clone_method'] == ""){
        msg+="请选择克隆方法"+"</br>";
        break;
      }
      if(step3DataClone[i]['insert_0_cloning-0-sequencing_primer_5'].length == 0){
        msg+="5端引物不能为空"+"</br>";
        break;
      }
      if(step3DataClone[i]['insert_0_cloning-0-clone_method'] == "1"){
        if(step3DataClone[i]['insert_0_cloning-0-clone_site_1']&&step3DataClone[i]['insert_0_cloning-0-clone_site_1'].length == 0){
          msg+="5端酶切位点不能为空"+"</br>";
          break;
        }
        if(step3DataClone[i]['insert_0_cloning-0-cs_1_destroyed']&&step3DataClone[i]['insert_0_cloning-0-cs_1_destroyed'] == ""){
          msg+="请选择5端酶切位点克隆过程中是否被破坏"+"</br>";
          break;
        }
        if(step3DataClone[i]['insert_0_cloning-0-clone_site_2']&&step3DataClone[i]['insert_0_cloning-0-clone_site_2'].length == 0){
          msg+="3端酶切位点不能为空"+"</br>";
          break;
        }
        if(step3DataClone[i]['insert_0_cloning-0-cs_2_destroyed']&&step3DataClone[i]['insert_0_cloning-0-cs_2_destroyed'] == ""){
          msg+="请选择3端酶切位点克隆过程中是否被破坏"+"</br>";
          break;
        }
      }
    }
    if(msg.length > 0){
      layer.alert(msg)
    }else {
      step3Data = JSON.stringify(step3Data);
      step3DataClone = JSON.stringify(step3DataClone);
      Ajax.call('user.php?act=step_3_save',"&step3Data="+step3Data+"&step3DataClone="+step3DataClone+"&share_id="+share_id+"&plasmid_name="+plasmid_name, dataStep3Response, 'POST', 'text');
    }
  }
  function dataStep3Response(result){
    window.location.href = '/user.php?act=share_detial&plasmid_name='+result+'&step=4'
  }
  //第四步的js
  function seectOther(ele,siblingEle,value){
    if ($("option:selected",ele).val() == value) {
      $(siblingEle).css({
        display:"block"
      })
    }else {
      $(siblingEle).css({
        display:"none"
      })
    }
  }
  function step4Next(){
    var frm = document.forms['geneStep4'];
    var share_id =  frm.elements['share_id'].value;
    var plasmid_name =  frm.elements['plasmid_name'].value;
    var msg = "";
    var step4Data = {};
    var checkValue = [];//定义一个空数组
    var checkValue1 = [];//定义一个空数组
    step4Data['growth-0-bacterial_resistance_other'] = frm.elements['growth-0-bacterial_resistance_other'].value;
    step4Data['growth-0-plasmid_copy'] = frm.elements['growth-0-plasmid_copy'].value;
    step4Data['growth-0-growth_strain'] = frm.elements['growth-0-growth_strain'].value;
    step4Data['growth-0-growth_strain_other'] = frm.elements['growth-0-growth_strain_other'].value;
    step4Data['growth-0-growth_temp'] = frm.elements['growth-0-growth_temp'].value;
    step4Data['growth-0-temperature_other'] = frm.elements['growth-0-temperature_other'].value;
    step4Data['growth-0-growth_notes'] = frm.elements['growth-0-growth_notes'].value;
    step4Data['growth-0-resistance_marker_other'] = frm.elements['growth-0-resistance_marker_other'].value;
    step4Data['growth-0-is_hazard'] = frm.elements['growth-0-is_hazard'].value;
    step4Data['growth-0-require_license'] = frm.elements['growth-0-require_license'].value;
    step4Data['growth-0-license_notes'] = frm.elements['growth-0-license_notes'].value;
    step4Data['growth-0-origin'] = frm.elements['growth-0-origin'].value;
    step4Data['growth-0-origin_notes'] = frm.elements['growth-0-origin_notes'].value;
    step4Data['growth-0-comments'] = frm.elements['growth-0-comments'].value;
    $("input[name='growth-0-bacterial_resistance']:checked").each(function(k){//把所有被选中的复选框的值存入数组
        checkValue[k] =$(this).val();
    });
    step4Data['bacterial_resistance'] = checkValue;
    $("input[name='growth-0-resistance_marker']:checked").each(function(k){//把所有被选中的复选框的值存入数组
        checkValue1[k] =$(this).val();
    });
    step4Data['resistance_marker'] = checkValue1;
    if(step4Data['bacterial_resistance'] ==""){
      msg+="请选择原核抗性"+"</br>";
    }
    if(step4Data['resistance_marker'] ==""){
      msg+="请选择筛选标记"+"</br>";
    }
    if($.inArray("10", step4Data['bacterial_resistance'])!=-1){
      if(step4Data['growth-0-bacterial_resistance_other'].length ==0){
        msg+="其他原核抗体信息不能为空"+"</br>";
      }
    }
    if($.inArray("12", step4Data['resistance_marker'])!=-1){
      if(step4Data['growth-0-resistance_marker_other'].length ==0){
        msg+="其他筛选标记不能为空"+"</br>";
      }
    }
    if(step4Data['growth-0-plasmid_copy'] ==""){
      msg+="请选择质粒的拷贝数情况"+"</br>";
    }
    if(step4Data['growth-0-growth_strain'] ==""){
      msg+="请选择克隆菌株"+"</br>";
    }
    if(step4Data['growth-0-growth_strain'] =="11"){
      if(step4Data['growth-0-growth_strain_other'].length == 0){
          msg+="其他的克隆菌株不能为空"+"</br>";
      }
    }
    if(step4Data['growth-0-growth_temp'] ==""){
      msg+="请选择培养温度"+"</br>";
    }
    if(step4Data['growth-0-growth_temp'] =="23"){
      if(step4Data['growth-0-temperature_other'].length == 0){
          msg+="请填写相应温度"+"</br>";
      }
    }
    if(step4Data['growth-0-is_hazard'] ==""){
      msg+="请选择此质粒及其表达产物是否会对人体产生危害"+"</br>";
    }
    if(step4Data['growth-0-is_hazard'] =="True"){
      msg+="很抱歉此质粒不支持分享"+"</br>";
    }
    if(step4Data['growth-0-require_license'] ==""){
      msg+="请选择您分享的材料是否有其它限制性条款"+"</br>";
    }
    if(step4Data['growth-0-require_license'] =="True"){
      if(step4Data['growth-0-license_notes'].length == 0){
        msg+="相应的限制性条款不能为空"+"</br>";
      }
    }
    if(step4Data['growth-0-origin'] ==""){
      msg+="请选择此材料中包含的某些序列是否有来源于第三方"+"</br>";
    }
    if(step4Data['growth-0-origin'] =="True"){
      if(step4Data['growth-0-origin_notes'].length == 0){
        msg+="第三方信息不能为空"+"</br>";
      }
    }
    if(msg.length > 0){
      layer.alert(msg)
    }else{
      step4Data = JSON.stringify(step4Data);
      Ajax.call('user.php?act=step_4_save',"&step4Data="+step4Data+"&share_id="+share_id+"&plasmid_name="+plasmid_name, dataStep4Response, 'POST', 'text');
    }
  }
  function dataStep4Response(result){
    window.location.href = '/user.php?act=share_detial&plasmid_name='+result+'&step=5'
  }
  //第五步js
  window.onload = function(){
    $(".small_images").eq(0).addClass("active1");
  }
  $(".small_images").click(function(){
    var imgHref = $(this).children("img").attr("src");
    $(this).addClass("active1").siblings().removeClass("active1");
    $(".imgInfo").children("a").attr({
      "href":imgHref,
    })
    $(".imgInfo").children("a").children("img").attr({
      "src":imgHref,
    })
    $(".MagicZoomBigImageCont").find("img").attr({
      "src":imgHref,
    });
    $(".MagicThumb-image").attr({
      "src":imgHref,
    });
  })
