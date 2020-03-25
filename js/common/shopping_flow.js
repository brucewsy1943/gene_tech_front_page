/* $Id : shopping_flow.js 4865 2007-01-31 14:04:10Z paulgao $ */

var selectedShipping = null;
var selectedPayment  = null;
var selectedPack     = null;
var selectedCard     = null;
var selectedSurplus  = '';
var selectedBonus    = 0;
var selectedIntegral = 0;
var selectedOOS      = null;
var alertedSurplus   = false;

var groupBuyShipping = null;
var groupBuyPayment  = null;
//判断购买签约产品是否填写了用户信息
function hasContract(){
  var contract = document.querySelectorAll(".xqy");
  if(contract.length > 0){
      Ajax.call('flow.php?step=is_profile','',profileResponse, 'GET', 'TEXT');
  }else {
    window.location.href="flow.php?step=checkout";
  }
}
function profileResponse(result){
  var json = JSON.parse(result);
  if(json.email==""||json.jgmc==null||json.jgdz==null||json.jgxz==null||json.mobile==""||json.zsxm==null){
    layer.alert("你购买的产品需要签约哦，请先完善个人信息",function(){
      window.location.href="user.php?act=profile";
    })
  }else {
    window.location.href="flow.php?step=checkout";
  }
}
//去掉字符串两端空格
function Trim(str)
 {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}
// 编辑收货人信息
function consignee_changes(data)
{
	Ajax.call('flow.php?step=consignee&&','address_id='+data, consignee_changesResponse , 'GET', 'JSON');
}

function consignee_changesResponse(result)
{
    var data=result.content;
    layer.open({
      type: 1,
      title: '编辑收货人信息',
      skin: 'layui-layer-rim', //加上边框
      area: '640px',
      content: data
    });

}

// 用户选择地址，提交用户选择的地址
function dizhi() {
  var father = $(".addressInfo input[name='addressId']:checked").parent();
  var address_id = $(".addressInfo input[name='addressId']:checked").val();
  var country = father.children(".addressInfo input[name='country']").val();
  var consignee = father.children(".addressInfo input[name='consignee']").val();
  var mobile = father.find(".addressInfo input[name='mobile']").val();
  var address = father.find(".addressInfo input[name='address']").val();
  var province = father.find(".user-address").children("[name='province']").val();
  var city = father.find(".user-address").children("[name='city']").val();
  var district = father.find(".user-address").children("[name='district']").val();
  $(".addressInfo").find(".modify").hide();
  father.find(".modify").show();
  document.getElementById("shippingBox").innerHTML='<font color="#d43f3a">&nbsp;&nbsp;&nbsp;正在重新导入配送区域，请稍候。。。</font>';
	Ajax.call('flow.php?step=shipping_change', 'country=' +country+'&province='+province+'&city='+city+'&district='+district , shippingBoxchangeResponse , 'GET', 'JSON');
  Ajax.call('flow.php?step=done', 'country=' +country+'&province='+province+'&city='+city+'&district='+district+'&address='+address , donechangeResponse , 'GET', 'text');
}

function shippingBoxchangeResponse(result)
{
  document.getElementById("shippingBox").innerHTML= result.content;

}
function donechangeResponse(result)
{
  layer.msg("收货人地址修改成功");
}


/* *
 * 改变配送方式
 */
function selectShipping(obj)
{
  var theForm = obj.form;
  var addressId = $(".addressInfo input[name='addressId']:checked").val();

  if (selectedShipping == obj)
  {
    return;
  }
  else
  {
    selectedShipping = obj;
  }


  var supportCod = obj.attributes['supportCod'].value + 0;


  for (i = 0; i < theForm.elements.length; i ++ )
  {
    if (theForm.elements[i].name == 'payment' && theForm.elements[i].attributes['isCod'].value == '1')
    {
      if (supportCod == 0)
      {
        theForm.elements[i].checked = false;
        theForm.elements[i].disabled = true;
      }
      else
      {
        theForm.elements[i].disabled = false;
      }
    }
  }

  if (obj.attributes['insure'].value + 0 == 0)
  {
    document.getElementById('ECS_NEEDINSURE').checked = false;
    document.getElementById('ECS_NEEDINSURE').disabled = true;
  }
  else
  {
    document.getElementById('ECS_NEEDINSURE').checked = false;
    document.getElementById('ECS_NEEDINSURE').disabled = false;
  }

   var now = new Date();
   console.log('flow.php?step=select_shipping', '&shipping=' + obj.value+'&addressId='+addressId);
   Ajax.call('flow.php?step=select_shipping', '&shipping=' + obj.value+'&addressId='+addressId, orderShippingSelectedResponse, 'GET', 'json'); //修改 by jianhualiucheng
}

/**
 *
 */
function orderShippingSelectedResponse(result)
{
  if (result.need_insure)
  {
    try
    {
      document.getElementById('ECS_NEEDINSURE').checked = true;
    }
    catch (ex)
    {
      layer.alert(ex.message);
    }
  }

  try
  {
    if (document.getElementById('ECS_CODFEE') != undefined)
    {
      document.getElementById('ECS_CODFEE').innerHTML = result.cod_fee;
    }
  }
  catch (ex)
  {
    layer.alert(ex.message);
  }

  orderSelectedResponse(result);
}

/* *
 * 回调函数
 */
function orderSelectedResponse(result)
{
  if (result.error)
  {
    layer.alert(result.error);
    location.href = './';
  }

  try
  {
    var layer = document.getElementById("ECS_ORDERTOTAL");
    layer.innerHTML = (typeof result == "object") ? result.content : result;

    if (result.payment != undefined)
    {
      var surplusObj = document.forms['theForm'].elements['surplus'];
      if (surplusObj != undefined)
      {
        surplusObj.disabled = result.pay_code !== 'balance';
      }
    }
  }
  catch (ex) { }
}





/* *
 * 改变支付方式
 */
function selectPayment(obj)
{
  if (selectedPayment == obj)
  {
    return;
  }
  else
  {
    selectedPayment = obj;
  }
  var addressId = $(".addressInfo input[name='addressId']:checked").val();

  Ajax.call('flow.php?step=select_payment', 'payment=' + obj.value + '&addressId=' + addressId, orderSelectedResponse, 'GET', 'JSON');
}
/* *
 * 团购购物流程 --> 改变配送方式
 */
function handleGroupBuyShipping(obj)
{
  if (groupBuyShipping == obj)
  {
    return;
  }
  else
  {
    groupBuyShipping = obj;
  }

  var supportCod = obj.attributes['supportCod'].value + 0;
  var theForm = obj.form;

  for (i = 0; i < theForm.elements.length; i ++ )
  {
    if (theForm.elements[i].name == 'payment' && theForm.elements[i].attributes['isCod'].value == '1')
    {
      if (supportCod == 0)
      {
        theForm.elements[i].checked = false;
        theForm.elements[i].disabled = true;
      }
      else
      {
        theForm.elements[i].disabled = false;
      }
    }
  }

  if (obj.attributes['insure'].value + 0 == 0)
  {
    document.getElementById('ECS_NEEDINSURE').checked = false;
    document.getElementById('ECS_NEEDINSURE').disabled = true;
  }
  else
  {
    document.getElementById('ECS_NEEDINSURE').checked = false;
    document.getElementById('ECS_NEEDINSURE').disabled = false;
  }

  Ajax.call('group_buy.php?act=select_shipping', 'shipping=' + obj.value, orderSelectedResponse, 'GET');
}

/* *
 * 团购购物流程 --> 改变支付方式
 */
function handleGroupBuyPayment(obj)
{
  if (groupBuyPayment == obj)
  {
    return;
  }
  else
  {
    groupBuyPayment = obj;
  }

  Ajax.call('group_buy.php?act=select_payment', 'payment=' + obj.value, orderSelectedResponse, 'GET');
}

/* *
 * 改变商品包装
 */
function selectPack(obj)
{
  if (selectedPack == obj)
  {
    return;
  }
  else
  {
    selectedPack = obj;
  }

  Ajax.call('flow.php?step=select_pack', 'pack=' + obj.value, orderSelectedResponse, 'GET', 'JSON');
}

/* *
 * 改变祝福贺卡
 */
function selectCard(obj)
{
  if (selectedCard == obj)
  {
    return;
  }
  else
  {
    selectedCard = obj;
  }

  Ajax.call('flow.php?step=select_card', 'card=' + obj.value, orderSelectedResponse, 'GET', 'JSON');
}

/* *
 * 选定了配送保价
 */
function selectInsure(needInsure)
{
  needInsure = needInsure ? 1 : 0;

  Ajax.call('flow.php?step=select_insure', 'insure=' + needInsure, orderSelectedResponse, 'GET', 'JSON');
}

/* *
 * 团购购物流程 --> 选定了配送保价
 */
function handleGroupBuyInsure(needInsure)
{
  needInsure = needInsure ? 1 : 0;

  Ajax.call('group_buy.php?act=select_insure', 'insure=' + needInsure, orderSelectedResponse, 'GET', 'JSON');
}



/* *
 * 改变余额
 */
function changeSurplus(val)
{
  if (selectedSurplus == val)
  {
    return;
  }
  else
  {
    selectedSurplus = val;
  }

  Ajax.call('flow.php?step=change_surplus', 'surplus=' + val, changeSurplusResponse, 'GET', 'JSON');
}

/* *
 * 改变余额回调函数
 */
function changeSurplusResponse(obj)
{
  if (obj.error)
  {
    try
    {
      document.getElementById("ECS_SURPLUS_NOTICE").innerHTML = obj.error;
      document.getElementById('ECS_SURPLUS').value = '0';
      document.getElementById('ECS_SURPLUS').focus();
    }
    catch (ex) { }
  }
  else
  {
    try
    {
      document.getElementById("ECS_SURPLUS_NOTICE").innerHTML = '';
    }
    catch (ex) { }
    orderSelectedResponse(obj.content);
  }
}

/* *
 * 改变积分
 */
function changeIntegral(val)
{
  if (selectedIntegral == val)
  {
    return;
  }
  else
  {
    selectedIntegral = val;
  }

  Ajax.call('flow.php?step=change_integral', 'points=' + val, changeIntegralResponse, 'GET', 'JSON');
}

/* *
 * 改变积分回调函数
 */
function changeIntegralResponse(obj)
{
  if (obj.error)
  {
    try
    {
      document.getElementById('ECS_INTEGRAL_NOTICE').innerHTML = obj.error;
      document.getElementById('ECS_INTEGRAL').value = '0';
      document.getElementById('ECS_INTEGRAL').focus();
    }
    catch (ex) { }
  }
  else
  {
    try
    {
      document.getElementById('ECS_INTEGRAL_NOTICE').innerHTML = '';
    }
    catch (ex) { }
    orderSelectedResponse(obj.content);
  }
}

/* *
 * 改变红包
 */
function changeBonus(val)
{
  if (selectedBonus == val)
  {
    return;
  }
  else
  {
    selectedBonus = val;
  }

  Ajax.call('flow.php?step=change_bonus', 'bonus=' + val, changeBonusResponse, 'GET', 'JSON');
}

/* *
 * 改变红包的回调函数
 */
function changeBonusResponse(obj)
{
  if (obj.error)
  {
    layer.alert(obj.error);

    try
    {
      document.getElementById('ECS_BONUS').value = '0';
    }
    catch (ex) { }
  }
  else
  {
    orderSelectedResponse(obj.content);
  }
}

/**
 * 验证红包序列号
 * @param string bonusSn 红包序列号
 */
function validateBonus(bonusSn)
{
  Ajax.call('flow.php?step=validate_bonus', 'bonus_sn=' + bonusSn, validateBonusResponse, 'GET', 'JSON');
}

function validateBonusResponse(obj)
{

if (obj.error)
  {
    layer.alert(obj.error);
    orderSelectedResponse(obj.content);
    try
    {
      document.getElementById('ECS_BONUSN').value = '0';
    }
    catch (ex) { }
  }
  else
  {
    orderSelectedResponse(obj.content);
  }
}

/* *
 * 改变发票的方式
 */
function changeNeedInv()
{
  var obj        = document.getElementById('ECS_NEEDINV');
  var objType    = document.getElementById('ECS_INVTYPE');
  var objPayee   = document.getElementById('ECS_INVPAYEE');
  var objContent = document.getElementById('ECS_INVCONTENT');
  var nsrsbh = document.getElementById('ECS_nsrsbh');
  var needInv    = obj.checked ? 1 : 0;
  var invType    = obj.value ? (objType != undefined ? objType.value : '') : '';
  var invPayee   = obj.value ? objPayee.value : '';
  var invContent = obj.value ? objContent.value : '';
  var nsrsbh = obj.value ? nsrsbh.value : '';

  if(obj.checked === true){
        $("#Taxpayer").css('display','block'); 
  }else{
        $("#Taxpayer").css('display','none');  
  }

  if(objType != null)
  {
    objType.disabled = ! obj.checked;
  }

  Ajax.call('flow.php?step=change_needinv', 'need_inv=' + needInv +'&nsrsbh='+encodeURIComponent(nsrsbh)+ '&inv_type=' + encodeURIComponent(invType) + '&inv_payee=' + encodeURIComponent(invPayee) + '&inv_content=' + encodeURIComponent(invContent), fpnews, 'GET');
}
function fpnews(){

}
/* *
 * 改变发票的方式
 */
function groupBuyChangeNeedInv()
{
  var obj        = document.getElementById('ECS_NEEDINV');
  var objPayee   = document.getElementById('ECS_INVPAYEE');
  var objContent = document.getElementById('ECS_INVCONTENT');
  var needInv    = obj.checked ? 1 : 0;
  var invPayee   = obj.checked ? objPayee.value : '';
  var invContent = obj.checked ? objContent.value : '';
  objPayee.disabled = objContent.disabled = ! obj.checked;

  Ajax.call('group_buy.php?act=change_needinv', 'need_idv=' + needInv + '&amp;payee=' + invPayee + '&amp;content=' + invContent, null, 'GET');
}

/* *
 * 改变缺货处理时的处理方式
 */
function changeOOS(obj)
{
  if (selectedOOS == obj)
  {
    return;
  }
  else
  {
    selectedOOS = obj;
  }

  Ajax.call('flow.php?step=change_oos', 'oos=' + obj.value, null, 'GET');
}

/* *
 * 检查提交的订单表单
 */
 // function hasContract2(){
 //   var contract = document.querySelectorAll(".xqy");
 //   if(contract.length > 0){
 //     Ajax.call('flow.php?step=is_profile','',profileResponse2, 'GET', 'TEXT');
 //   }else {
 //     checkOrderForm()
 //   }
 // }
 // function profileResponse2(result){
 //   var json = JSON.parse(result);
 //   if(json.email==null||json.jgdh==null||json.jgdh==null||json.jgmc==null||json.jgxz=="--请选择--"||json.mobile==null||json.zsxm==""){
 //     layer.alert("你购买的产品需要签约哦，请先完善个人信息",function(){
 //       window.location.href="user.php?act=profile";
 //     })
 //   }else {
 //     checkOrderForm()
 //   }
 // }
function checkOrderForm()
{
    var frm = document.forms['theForm'];
     var paymentSelected = false;
    // var shippingSelected = false;
    if(!document.querySelector(".addressInfo")){
      layer.alert("你还没有收货地址");
      return false;
    }
    //检查是否选择了支付配送方式
    for (i = 0; i < frm.elements.length; i ++ )
    {
      // if (frm.elements[i].name == 'shipping' && frm.elements[i].checked)
      // {
      //   shippingSelected = true;
      // }

      if (frm.elements[i].name == 'payment' && frm.elements[i].checked)
      {
        paymentSelected = true;
      }
    }

    // if ( ! shippingSelected)
    // {
    //   layer.alert(flow_no_shipping);
    //   return false;
    // }

    if ( ! paymentSelected)
    {
      layer.alert(flow_no_payment);
      return false;
    }

    // 检查用户输入的余额
    if (document.getElementById("ECS_SURPLUS"))
    {
      var surplus = document.getElementById("ECS_SURPLUS").value;
      var error   = Utils.trim(Ajax.call('flow.php?step=check_surplus', 'surplus=' + surplus, null, 'GET', 'TEXT', false));

      if (error)
      {
        try
        {
          document.getElementById("ECS_SURPLUS_NOTICE").innerHTML = error;
        }
        catch (ex)
        {
        }
        return false;
      }
    }

    // 检查用户输入的积分
    if (document.getElementById("ECS_INTEGRAL"))
    {
      var integral = document.getElementById("ECS_INTEGRAL").value;
      var error    = Utils.trim(Ajax.call('flow.php?step=check_integral', 'integral=' + integral, null, 'GET', 'TEXT', false));

      if (error)
      {
        return false;
        try
        {
          document.getElementById("ECS_INTEGRAL_NOTICE").innerHTML = error;
        }
        catch (ex)
        {
        }
      }
    }
    //检查是否需要发票的验证
    if(document.getElementById("ECS_NEEDINV").checked){
      var fptt = document.getElementById("ECS_INVPAYEE").value;
      var nsrsbh = document.getElementById("ECS_nsrsbh").value;
      var fpnr = document.getElementById("ECS_INVCONTENT").value;
      var msgerr="";
      if(Trim(fptt).length=="0"){
        msgerr += "发票抬头不能为空"+"</br>";
      }
      if(checkNsrsbh(nsrsbh).length>0){
        msgerr += checkNsrsbh(nsrsbh)+"</br>";
      }
      if(Trim(fpnr).length =="0"){
        msgerr += "发票抬头不能为空"+"</br>";
      }
      if (msgerr.length > 0)
      {
        layer.alert(msgerr);
        return false;
      }
      else
      {
      return true;
      }

    }
    frm.action = frm.action + '?step=done'+'&contract='+contract;
    return true;
}
// 验证纳税人识别号
function checkNsrsbh(sbh){
  var taxpayerId = sbh;
  var msg = "";
  //纳税人识别号校验是否合法
  if(Trim(taxpayerId) == ''){
   msg += "纳税人识别号不能为空"+"</br>";
  }
  else if(Trim(taxpayerId).length==15|| Trim(taxpayerId).length==18||Trim(taxpayerId).length==20){
    var addressCode = taxpayerId.substring(0,6);
    // 校验地址码
    var check = checkAddressCode(addressCode);
    if(!check) {
      msg += "请输入正确的纳税人识别号！"+"</br>";
    }else{
     // 校验组织机构代码
     var orgCode = taxpayerId.substring(6,15);
     check = orgcodevalidate(orgCode);
     if(!check){
      msg += "请输入正确的纳税人识别号！"+"</br>" ;
      nsrsbh = false;
    }
    }
  }
  else{
    msg += "请输入正确的纳税人识别号！"+"</br>";
  }
  return msg;
}
// 校验nsrsbh组织机构代码
function orgcodevalidate(value){
 if(value!=""){
  var part1=value.substring(0,8);
  console.log(part1);
  var part2=value.substring(value.length-1,1);
  console.log(part2);
  var ws = [3, 7, 9, 10, 5, 8, 4, 2];
  var str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var reg = /^([0-9A-Z]){8}$/;
  if (!reg.test(part1))
  {
   return true
  }
  var sum = 0;
  for (var i = 0; i< 8; i++)
  {
   sum += str.indexOf(part1.charAt(i)) * ws[i];
  }
  var C9 = 11 - (sum % 11);
  var YC9=part2+'';
  if (C9 == 11) {
   C9 = '0';
  } else if (C9 == 10) {
   C9 = 'X' ;
  } else {
   C9 = C9+'';
  }
  return YC9!=C9;
}
}
// 校验nsrsbh地址码
function checkAddressCode(addressCode){
   var provinceAndCitys={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",
    31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",
    45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",
    65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
   var check = /^[1-9]\d{5}$/.test(addressCode);
   if(!check) return false;
   if(provinceAndCitys[parseInt(addressCode.substring(0,2))]){
     return true;
   }else{
     return false;
   }

}
/* *
 * 检查收货地址信息表单中填写的内容
 */
function checkConsignee(frm)
{

  var msg = new Array();
  var err = false;
  //console.log(frm)
  if (frm.elements['country'] && frm.elements['country'].value == 0)
  {
    msg.push(country_not_null);
    err = true;
  }

  if (frm.elements['province'] && frm.elements['province'].value == 0 && frm.elements['province'].length > 1)
  {
    msg.push(province_not_null);
    err = true;
  }

  if (frm.elements['city'] && frm.elements['city'].value == 0 && frm.elements['city'].length > 1)
  {
    msg.push(city_not_null);
    err = true;
  }

  if (frm.elements['district'] && frm.elements['district'].length > 1)
  {
    if (frm.elements['district'].value == 0)
    {
      msg.push(district_not_null);
      err = true;
    }
  }

  if (Utils.isEmpty(frm.elements['consignee'].value))
  {
    msg.push(consignee_not_null);
    err = true;
  }

  if (frm.elements['address'] && Utils.isEmpty(frm.elements['address'].value))
  {
    msg.push(address_not_null);
    err = true;
  }
  if(isMobile (frm.elements['mobile'].value)){
    msg.push("手机号码格式不正确！");
    err = true;
  }
  if (err)
  {
    message = msg.join("</br>");
    layer.alert(message,{icon: 2});
  }
    return !err
}
function isMobile (num){
  var isMobile = /^(?:13\d|15\d|18\d|17\d)\d{5}(\d{3}|\*{3})$/;
  if(!isMobile.test(num)){
    return true;
  }else {
    return false;
  }
}
