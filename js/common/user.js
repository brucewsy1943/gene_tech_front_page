/* $Id : user.js 4865 2007-01-31 14:04:10Z paulgao $ */
/* *
 * 设为默认收货地址
 */
    for(var i = 0; i < $(".tel").length; i++){
      $('.tel')[i].innerText=$('.tel')[i].innerText.substr(0, 3) + '****' + $('.tel')[i].innerText.substr(7);
    }
    function changeStatus(address_id){
      var address_id = address_id;
      Ajax.call('user.php?act=defaut_address','address_id='+ address_id,changeStatusResponse, 'GET', 'text');
    }
    function changeStatusResponse(result){
      //console.log(result);
        if(result=="true"){
          layer.alert("默认收货地址设置成功！")
        }else{
          layer.alert("默认收货地址设置失败！")
        }
    }
 /* *
  * 删除收货地址
  */
 function delete_address(address_id){
       layer.alert('您确定要删除收货地址嘛？', function(){
       Ajax.call('user.php?act=drop_consignee', 'address=' + address_id, deleteaddressResponse, 'POST', 'TEXT');
    });
   };
 function deleteaddressResponse(data){
   if(data == 'true'){
       window.location.reload(true);
       layer.msg('收货地址已删除', {icon: 1});
   }
 };
 /* *
  * 删除历史订单，进回收站
  */
 function delete_order(user_id,order_id){
    layer.confirm('您确定要删除该订单吗？', {
       btn: ['确定','取消'] //按钮
    }, function(){
      console.log('user.php?act=delete_order','&user_id='+user_id+'&order_id='+order_id);
       Ajax.call('user.php?act=delete_order','&user_id='+user_id+'&order_id='+order_id, order_deleteResponse , 'GET', 'text');
    });
 };
 function order_deleteResponse(result)
 {
   if(result == 'true'){
       layer.msg('订单已删除', {icon: 1});
       window.location.reload(true);
   }
 }
 /* *
  * 修改订单详情收货地址
  */
 function updateDetailAddress(){
   var frm = document.forms['formAddress'];
   var consignee = frm.elements['consignee'].value;
   var address = frm.elements['address'].value;
   var mobile = frm.elements['mobile'].value;
   var order_id = frm.elements['order_id'].value;
   var msg = '';
   if(consignee.length == 0){
     msg += "收货人姓名不能为空" + '</br>';
   }
   if(address.length == 0){
     msg += "收货地址不能为空" + '</br>';
   }
   if(mobile.length == 0){
     msg += "手机号不能为空" + '</br>';
   }else if (!isPhone(mobile))
   {
     msg += '请输入正确的手机号！</br>';
   }

   if (msg.length > 0)
   {
     layer.alert(msg);
     return false;
   }
   else
   {
     //console.log('user.php?act=save_order_address',"&consignee="+consignee+"&address="+address+"&mobile="+mobile+"&order_id="+order_id);
     Ajax.call('user.php?act=save_order_address',"&consignee="+consignee+"&address="+address+"&mobile="+mobile+"&order_id="+order_id, detailAddressResponse, 'GET', 'TEXT');
   }
 }
 function detailAddressResponse(result) {
   console.log(result);
   if(result == "true"){
     layer.alert("账号信息修改成功",function(){
       window.location.reload();
     })
   }
 }
/* *
 * 修改会员信息
 */
function userEdit()
{
  var frm = document.forms['formEdit'];
  var email = frm.elements['email'].value;
  var name = frm.elements['extend_field7'].value;
  var jgxz = frm.elements['extend_field8'].value;
  var jgmc = frm.elements['extend_field9'].value;
  var jgdh = frm.elements['extend_field10'].value;
  var jgdz = frm.elements['extend_field11'].value;
  var mobile = frm.elements['extend_field5'].value;
  var msg = '';
  var reg = null;
  var passwd_answer = frm.elements['passwd_answer'] ? Utils.trim(frm.elements['passwd_answer'].value) : '';
  var sel_question =  frm.elements['sel_question'] ? Utils.trim(frm.elements['sel_question'].value) : '';

  if(jgdz.length == 0){
    msg += "机构地址不能为空" + '</br>';
  }
  if(jgxz == "--请选择--"){
    msg += "请选择机构性质" + '</br>';
  }
  if(jgmc.length == 0){
    msg += "机构名称不能为空" + '</br>';
  }
  if(name.length == 0){
    msg += "真实姓名不能为空" + '</br>';
  }
  if(mobile.length == 0){
    msg += "手机号不能为空" + '</br>';
  }
  if (email.length == 0)
  {
    msg += email_empty + '</br>';
  }
  else
  {
    if ( ! (Utils.isEmail(email)))
    {
      msg += email_error + '</br>';
    }
  }

  if (passwd_answer.length > 0 && sel_question == 0 || document.getElementById('passwd_quesetion') && passwd_answer.length == 0)
  {
    msg += no_select_question + '</br>';
  }

  for (i = 7; i < frm.elements.length - 2; i++)	// 从第七项开始循环检查是否为必填项
  {
	needinput = document.getElementById(frm.elements[i].name + 'i') ? document.getElementById(frm.elements[i].name + 'i') : '';

	if (needinput != '' && frm.elements[i].value.length == 0)
	{
	  msg += '- ' + needinput.innerHTML + msg_blank + '</br>';
	}
  }

  if (msg.length > 0)
  {
    layer.alert(msg);
    return false;
  }
  else
  {
    //console.log('user.php?act=act_edit_profile',"&name="+name+"&jgxz="+jgxz+"&jgmc="+jgmc+"&jgdh="+jgdh+"&jgdz="+jgdz+"&email="+email);
    Ajax.call('user.php?act=act_edit_profile',"&name="+name+"&jgxz="+jgxz+"&jgmc="+jgmc+"&jgdh="+jgdh+"&jgdz="+jgdz+"&email="+email, userEditResponse, 'GET', 'TEXT');
  }
}
function userEditResponse (result){
  if(result=="1"){
    layer.alert("账号信息修改成功",function(){
      window.location.reload();
    })
  }
}
/* 会员修改密码 */
function editPassword()
{
  var frm              = document.forms['formPassword'];
  var old_password     = frm.elements['old_password'].value;
  var new_password     = frm.elements['new_password'].value;
  var confirm_password = frm.elements['comfirm_password'].value;

  var msg = '';
  var reg = null;
  if (old_password.length == 0)
  {
    msg += "原始密码不能为空" + '</br>';
  }
  if (new_password.length == 0)
  {
    msg += "新密码不能为空" + '</br>';
  }
  if (new_password.length < 6)
  {
    msg += "密码长度不能小于6个字符" + '</br>';
  }
  if (confirm_password.length == 0)
  {
    msg += "确认密码不能为空" + '</br>';
  }

  if (new_password.length > 0 && confirm_password.length > 0)
  {
    if (new_password != confirm_password)
    {
      msg += "新密码和确认密码不一样" + '</br>';
    }
  }
  if (msg.length > 0)
  {
    layer.alert(msg);
    return false;
  }
  else
  {
    Ajax.call('user.php?act=act_edit_password',"&old_password="+old_password+"&new_password="+new_password, get_password_codeResponse, 'POST', 'TEXT');
  }
}
function get_password_codeResponse(result){
    if(result == '密码修改成功'){
      layer.alert(result,function(){
        window.location.reload();
      });

    }
    if(result !== '密码修改成功'){
      layer.alert(result);
    }
}

/* 会员绑定手机 */
function bindMobile()
{
  var frm        = document.forms['formBindmobile'];
  var mobile     = frm.elements['mobile'].value;
  var verifycode = frm.elements['verifycode'].value;
  var smscode = frm.elements['smscode'].value;
  var msg = '';
  var reg = null;

  if (mobile.length == 0)
  {
    msg += '手机号不能为空！</br>';
  }
  else if (!isPhone(mobile))
  {
    msg += '请输入正确的手机号！</br>';
  }

  if (verifycode.length == 0)
  {
    msg += '手机验证码不能为空！</br>';
  }
  else if (verifycode.length != 6)
  {
    msg += '手机验证码必须为6位！</br>';
  }
  if(smscode.length==0){
    msg += '图形验证码不能为空！'
  }
  if (msg.length > 0)
  {
    layer.alert(msg);
    return false;
  }
  else
  {
   //console.log('user.php?act=act_bindmobile',"&mobile="+mobile+"&verifycode="+verifycode+"&smscode="+smscode);
    Ajax.call('user.php?act=act_bindmobile',"&mobile="+mobile+"&verifycode="+verifycode, bindMobileResponse, 'GET', 'TEXT');
  }
}
function isPhone(str){
      var reg = /^(?:13\d|15\d|18\d|17\d)\d{5}(\d{3}|\*{3})$/;
      return reg.test(str);
}
function bindMobileResponse(result){
  if(result=='0'){
    layer.alert('手机号已经绑定过其他帐号！</br>')
  }else if(result=='1'){
    layer.alert("你的手机验证码错误！</br>")
  }else if(result=='2'){
    layer.alert("手机号绑定成功！</br>",{closeBtn: 0},function(){
      window.location.href="./user.php?act=profile"
    });
  }else if(result=='3'){
    alert("3")
  }
}
// 会员绑定邮箱
function bindEmail()
{
  var frm        = document.forms['formBindemail'];
  var email     = frm.elements['email'].value;
  var captcha     = frm.elements['captcha'].value;
  var szReg=/^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
  var msg = '';
  var reg = null;

  if (email.length == 0)
  {
    msg += '邮箱不能为空！</br>';
  }else if(!isEmail(email)) {
      msg += '您输入邮箱不正确！</br>'
    }
  if(captcha.length == 0){
    msg += '验证码不能为空空！</br>'
  }
  if (msg.length > 0)
  {
    layer.alert(msg);
    return false;
  }
  else
  {
    //console.log('user.php?act=act_bindemail',"&email="+email+"&captcha="+captcha);
    Ajax.call('user.php?act=act_bindemail',"&email="+email+"&captcha="+captcha, bindEmailResponse, 'GET', 'TEXT');
  }
}
function bindEmailResponse(result){
  if(result=="0"){
    layer.alert("验证码错误");
  }else {
    layer.alert("邮箱绑定成功！</br>",{closeBtn: 0},function(){
      window.location.href="./user.php?act=profile"
    });
  }
}
function isEmail(str){
      var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
      return reg.test(str);
}
/* *
 * 对会员的留言输入作处理
 */
function submitMsg()
{
  var frm         = document.forms['formMsg'];
  var msg_title   = frm.elements['msg_title'].value;
  var msg_content = frm.elements['msg_content'].value;
  var msg = '';

  if (msg_title.length == 0)
  {
    msg += msg_title_empty + '</br>';
  }
  if (msg_content.length == 0)
  {
    msg += msg_content_empty + '</br>'
  }

  if (msg_title.length > 200)
  {
    msg += msg_title_limit + '</br>';
  }

  if (msg.length > 0)
  {
    layer.alert(msg);
    return false;
  }
  else
  {
    return true;
  }
}

/* *
 * 会员找回密码时，对输入作处理
 */
function submitPwdInfo()
{
  var frm = document.forms['getPassword'];
  //var user_name = frm.elements['user_name'].value;
  var email     = frm.elements['email'].value;
  var email_code  = frm.elements['email_code'].value;

  var errorMsg = '';
  // if (user_name.length == 0)
  // {
  //   errorMsg += user_name_empty + '</br>';
  // }
  if(email_code.length == 0){
    errorMsg += "邮箱验证码不能为空" + '</br>';
  }
  if (email.length == 0)
  {
    errorMsg += email_address_empty + '</br>';
  }
  else
  {
    if ( ! isEmail(email))
    {
      errorMsg += email_address_error + '</br>';
    }
  }

  if (errorMsg.length > 0)
  {
    layer.alert(errorMsg);
    return false;
  }else{
    //console.log('user.php?act=send_pwd_email',"&email="+email+"&email_code="+email_code);
    Ajax.call('user.php?act=send_pwd_email',"&email="+email+"&email_code="+email_code, findPwdEmailResponse, 'POST', 'TEXT');
  }
}
function findPwdEmailResponse(result){
  console.log(result);
  if(result=="0"){
    layer.alert("验证码错误");
  }else if(result=="1"){
    layer.alert("您输入的邮箱不正确");
  }else {
    window.location.href='/'+result;
  }
}


//互亿无线代码
/* *
 * 会员找回密码时，对输入作处理
 */
function submitPwdMobileInfo()
{
  var frm = document.forms['getPasswordByMobile'];
  var user_name = frm.elements['user_name'].value;
  var mobile     = frm.elements['mobile'].value;

  var errorMsg = '';
  if (user_name.length == 0)
  {
    errorMsg += user_name_empty + '</br>';
  }

  if (mobile.length == 0)
  {
    errorMsg += mobile_address_empty + '</br>';
  }else if( !isPhone(mobile))
    {
      errorMsg += mobile_address_error + '</br>';
    }

  if (errorMsg.length > 0)
  {
    layer.alert(errorMsg);
    return false;
  }else {
    //console.log('user.php?act=send_pwd_mobile',"&username="+user_name+"&mobile="+mobile);
    Ajax.call('user.php?act=send_pwd_mobile',"&user_name="+user_name+"&mobile="+mobile, findPwdMoblieResponse, 'POST', 'TEXT');
  }
}
//互亿无线代码
function findPwdMoblieResponse(result){
    if(result=='1'){
      layer.alert("您的新密码已成功发送到手机！",function(){
        window.location.href="./user.php?act=login";
      })
    }else if(result=='2'){
      layer.alert("找回密码失败")
    }else if(result=='3'){
      layer.alert("您的新密码发送到手机失败：")
    }else if(result=='4'){
      layer.alert("用户名与手机不匹配")
    }
}


/* *
 * 会员找回密码时，对输入作处理
 */
function submitPwd()
{
  var frm = document.forms['getPassword2'];
  var new_password = frm.elements['new_password'].value;
  var confirm_password = frm.elements['confirm_password'].value;
  var uid = frm.elements['uid'].value;
  var code = frm.elements['code'].value;

  var errorMsg = '';
  if (new_password.length == 0)
  {
    errorMsg += new_password_empty + '</br>';
  }

  if (confirm_password.length == 0)
  {
    errorMsg += confirm_password_empty + '</br>';
  }

  if (confirm_password != new_password)
  {
    errorMsg += both_password_error + '</br>';
  }

  if (errorMsg.length > 0)
  {
    layer.alert(errorMsg);
    return false;
  }
  else
  {
    Ajax.call('user.php?act=act_edit_password',"&new_password="+new_password+"&uid="+uid+"&code="+code, submitPwdResponse, 'POST', 'TEXT');
  }
}
function submitPwdResponse(result){
  if(result="密码修改成功"){
    layer.alert(result,{closeBtn: 0},function(){
      window.location.href="/user.php?act=login"
    });
  }
}
/* *
 * 处理会员提交的缺货登记
 */
function addBooking()
{
  var frm  = document.forms['formBooking'];
  var goods_id = frm.elements['id'].value;
  var rec_id  = frm.elements['rec_id'].value;
  var number  = frm.elements['number'].value;
  var desc  = frm.elements['desc'].value;
  var linkman  = frm.elements['linkman'].value;
  var email  = frm.elements['email'].value;
  var tel  = frm.elements['tel'].value;
  var msg = "";

  if (number.length == 0)
  {
    msg += booking_amount_empty + '</br>';
  }
  else
  {
    var reg = /^[0-9]+/;
    if ( ! reg.test(number))
    {
      msg += booking_amount_error + '</br>';
    }
  }

  if (desc.length == 0)
  {
    msg += describe_empty + '</br>';
  }

  if (linkman.length == 0)
  {
    msg += contact_username_empty + '</br>';
  }

  if (email.length == 0)
  {
    msg += email_empty + '</br>';
  }
  else
  {
    if ( ! (Utils.isEmail(email)))
    {
      msg += email_error + '</br>';
    }
  }

  if (tel.length == 0)
  {
    msg += contact_phone_empty + '</br>';
  }

  if (msg.length > 0)
  {
    layer.alert(msg);
    return false;
  }

  return true;
}

/* *
 * 会员登录
 */
function userLogin()
{
  var frm      = document.forms['formLogin'];
  var username = frm.elements['username'].value;
  var password = frm.elements['password'].value;
  var captcha  = frm.elements['captcha'].value;
  var msg = '';

  if (username.length == 0)
  {
    msg += username_empty + '</br>';
  }

  if (password.length == 0)
  {
    msg += password_empty + '</br>';
  }
  if (captcha.length == 0)
  {
    msg += '- 验证码不能为空！' + '</br>';
  }
  if (msg.length > 0)
  {
    layer.alert(msg);
    return false;
  }
  else
  {
    Ajax.call('user.php?act=act_login',"&username="+username+"&password="+password+"&captcha="+captcha, get_loginResponse, 'POST', 'TEXT');
  }
}
function get_loginResponse(result){
  if(result == "0"){
    layer.alert("验证码错误!</br>",{closeBtn: 0},function(){
      window.location.reload();
    });
  }
  else if(result == "1"){
    // layer.alert("登录成功!</br>",{closeBtn: 0},function(){
    //   window.location.href='jinyin.org/user.php';
    // });
      window.location.href='/user.php';
  }
  else if(result == "2"){
    layer.alert("用户名或密码错误！</br>",{closeBtn: 0},function(){
      window.location.reload();
    });
  }

}

function chkstr(str)
{
  for (var i = 0; i < str.length; i++)
  {
    if (str.charCodeAt(i) < 127 && !str.substr(i,1).match(/^\w+$/ig))
    {
      return false;
    }
  }
  return true;
}

// function check_password( password )
// {
//     if ( password.length < 6 )
//     {
//         document.getElementById('password_notice').innerHTML = password_shorter;
//
//
//     }
//     else
//     {
//         document.getElementById('password_notice').innerHTML = msg_can_rg;
//     }
// }

// function check_conform_password( conform_password )
// {
//     password = document.getElementById('password1').value;
//
//     if ( conform_password.length < 6 )
//     {
//         document.getElementById('conform_password_notice').innerHTML = password_shorter;
//         return false;
//     }
//     if ( conform_password != password )
//     {
//         document.getElementById('conform_password_notice').innerHTML = confirm_password_invalid;
//     }
//     else
//     {
//         document.getElementById('conform_password_notice').innerHTML = msg_can_rg;
//     }
// }

// function is_registered( username )
// {
//     var submit_disabled = false;
// 	var unlen = username.replace(/[^\x00-\xff]/g, "**").length;
//
//     if ( username == '' )
//     {
//         document.getElementById('username_notice').innerHTML = msg_un_blank;
//         var submit_disabled = true;
//     }
//
//     if ( !chkstr( username ) )
//     {
//         document.getElementById('username_notice').innerHTML = msg_un_format;
//         var submit_disabled = true;
//     }
//     if ( unlen < 3 )
//     {
//         document.getElementById('username_notice').innerHTML = username_shorter;
//         var submit_disabled = true;
//     }
//     if ( unlen > 14 )
//     {
//         document.getElementById('username_notice').innerHTML = msg_un_length;
//         var submit_disabled = true;
//     }
//     if ( submit_disabled )
//     {
//         document.forms['formUser'].elements['Submit'].disabled = 'disabled';
//         return false;
//     }
//     Ajax.call( 'user.php?act=is_registered', 'username=' + username, registed_callback , 'GET', 'TEXT', true, true );
// }
function check_num (num){
  var isMobile = /^(?:13\d|15\d|18\d|17\d)\d{5}(\d{3}|\*{3})$/;
  var isPhone = /^((0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/;
  if(num==""){
    document.getElementById('check_jgdh').innerHTML = "电话号码不能为空";
  }
  else if(!isMobile.test(num) && !isPhone.test(num)){
      document.getElementById('check_jgdh').innerHTML = "请输入正确的号码";
  }
  else{
      document.getElementById('check_jgdh').innerHTML = "";
  }
}
// function registed_callback(result)
// {
//   if ( result == "true" )
//   {
//     document.getElementById('username_notice').innerHTML = msg_can_rg;
//     document.forms['formUser'].elements['Submit'].disabled = '';
//   }
//   else
//   {
//     document.getElementById('username_notice').innerHTML = msg_un_registered;
//     document.forms['formUser'].elements['Submit'].disabled = 'disabled';
//   }
// }

// function checkEmail(email)
// {
//   var submit_disabled = false;
//
//   if (email == '')
//   {
//     document.getElementById('email_notice').innerHTML = msg_email_blank;
//     submit_disabled = true;
//   }
//   else if (!Utils.isEmail(email))
//   {
//     document.getElementById('email_notice').innerHTML = msg_email_format;
//     submit_disabled = true;
//   }
//
//   if( submit_disabled )
//   {
//     document.forms['formUser'].elements['Submit'].disabled = 'disabled';
//     return false;
//   }
//   Ajax.call( 'user.php?act=check_email', 'email=' + email, check_email_callback , 'GET', 'TEXT', true, true );
// }
//
// function check_email_callback(result)
// {
//   if ( result == 'ok' )
//   {
//     document.getElementById('email_notice').innerHTML = msg_can_rg;
//     document.forms['formUser'].elements['Submit'].disabled = '';
//   }
//   else
//   {
//     document.getElementById('email_notice').innerHTML = msg_email_registered;
//     document.forms['formUser'].elements['Submit'].disabled = 'disabled';
//   }
// }
// function check_phoneNum(number)
// {
//
//   if (number == '')
//   {
//     document.getElementById('check_phoneNum_notice').innerHTML = msg_phone_blank;
//     submit_disabled = true;
//   }else if (!(/^1(3|4|5|7|8)\d{9}$/.test(number))) {
//     document.getElementById('check_phoneNum_notice').innerHTML = mobile_phone_invalid;
//   }else {
//     document.getElementById('check_phoneNum_notice').innerHTML = msg_can_rg;
//   }
// }
/* *
 * 处理注册用户
 */
function register()
{
  var frm  = document.forms['formUser'];
  var username  = Utils.trim(frm.elements['username'].value);
  var email  = frm.elements['email'].value;
  var password  = Utils.trim(frm.elements['password'].value);
  var confirm_password = Utils.trim(frm.elements['confirm_password'].value);
  var captcha = Utils.trim(frm.elements['captcha'].value);
  var checked_agreement = frm.elements['agreement'].checked;
  //var msn = frm.elements['extend_field1'] ? Utils.trim(frm.elements['extend_field1'].value) : '';
  //var qq = frm.elements['extend_field2'] ? Utils.trim(frm.elements['extend_field2'].value) : '';
  //var home_phone = frm.elements['extend_field4'] ? Utils.trim(frm.elements['extend_field4'].value) : '';
  //var office_phone = frm.elements['extend_field3'] ? Utils.trim(frm.elements['extend_field3'].value) : '';
  var mobile_phone = frm.elements['extend_field5'] ? Utils.trim(frm.elements['extend_field5'].value) : '';
  var sms_verifycode = frm.elements['sms_verifycode'] ? Utils.trim(frm.elements['sms_verifycode'].value) : '';
  var passwd_answer = frm.elements['passwd_answer'] ? Utils.trim(frm.elements['passwd_answer'].value) : '';
  var sel_question =  frm.elements['sel_question'] ? Utils.trim(frm.elements['sel_question'].value) : '';
  var msg = "";
  // 检查输入
  var msg = '';
  if (username.length == 0)
  {
    msg += username_empty + '</br>';
  }
  else if (username.match(/^\s*$|^c:\\con\\con$|[%,\'\*\"\s\t\<\>\&\\]/))
  {
    msg += username_invalid + '</br>';
  }
  else if (username.replace(/[\u0391-\uFFE5]/g,"aa").length < 3)
  {
    msg += username_shorter + '</br>';
  }

  if (email.length == 0)
  {
    msg += email_empty + '</br>';
  }
  else
  {
    if ( ! (Utils.isEmail(email)))
    {
      msg += email_invalid + '</br>';
    }
  }
  if (password.length == 0)
  {
    msg += password_empty + '</br>';
  }
  else if (password.length < 6)
  {
    msg += password_shorter + '</br>';
  }
  if (/ /.test(password) == true)
  {
	msg += passwd_balnk + '</br>';
  }
  if (confirm_password != password )
  {
    msg += confirm_password_invalid + '</br>';
  }
  if(checked_agreement != true)
  {
    msg += agreement + '</br>';
  }

  // if (msn.length > 0 && (!Utils.isEmail(msn)))
  // {
  //   msg += msn_invalid + '</br>';
  // }
  //
  // if (qq.length > 0 && (!Utils.isNumber(qq)))
  // {
  //   msg += qq_invalid + '</br>';
  // }
  if (captcha.length == 0)
  {
    msg += "- 图形验证码不能为空" + '</br>';
  }
  if (sms_verifycode.length==0){
    msg += "- 短信验证码不能为空" + '</br>';
  }
  // if (office_phone.length>0)
  // {
  //   var reg = /^[\d|\-|\s]+$/;
  //   if (!reg.test(office_phone))
  //   {
  //     msg += office_phone_invalid + '</br>';
  //   }
  // }
  // if (home_phone.length>0)
  // {
  //   var reg = /^[\d|\-|\s]+$/;
  //
  //   if (!reg.test(home_phone))
  //   {
  //     msg += home_phone_invalid + '</br>';
  //   }
  // }
  if (mobile_phone.length>0)
  {
    var reg = /^1(3|4|5|7|8)\d{9}$/;
    if (!reg.test(mobile_phone))
    {
      msg += mobile_phone_invalid + '</br>';
    }
  }
  if (passwd_answer.length > 0 && sel_question == 0 || document.getElementById('passwd_quesetion') && passwd_answer.length == 0)
  {
    msg += no_select_question + '</br>';
  }

  for (i = 4; i < frm.elements.length - 4; i++)	// 从第五项开始循环检查是否为必填项
  {
	needinput = document.getElementById(frm.elements[i].name + 'i') ? document.getElementById(frm.elements[i].name + 'i') : '';

	if (needinput != '' && frm.elements[i].value.length == 0)
	{
	  msg += '- ' + needinput.innerHTML + msg_blank + '</br>';
	}
  }

  if (msg.length > 0)
  {
    layer.alert(msg);
    return false;
  }
  else
  {
    //console.log('user.php?act=act_register',"&username="+username+"&password="+password+"&email="+email+"&confirm_password="+confirm_password+"&checked_agreement="+checked_agreement+"&mobile_phone="+mobile_phone+"&sms_verifycode="+sms_verifycode+'&captcha='+captcha);
  Ajax.call('user.php?act=act_register',"&username="+username+"&password="+password+"&email="+email+"&confirm_password="+confirm_password+"&checked_agreement="+checked_agreement+"&mobile_phone="+mobile_phone+"&sms_verifycode="+sms_verifycode+'&captcha='+captcha, get_registerResponse, 'POST', 'JSON');
  }
}
function get_registerResponse(result){
  if(result.error=='4'){
    layer.alert("注册成功!</br>",{closeBtn: 0},function(){
      window.location.href='user.php';
    });
  }else {
    layer.alert(result.message);
  }
}
/* *
 * 用户中心订单保存地址信息
 */
function saveOrderAddress(id)
{
  var frm           = document.forms['formAddress'];
  var consignee     = frm.elements['consignee'].value;
  var email         = frm.elements['email'].value;
  var address       = frm.elements['address'].value;
  var zipcode       = frm.elements['zipcode'].value;
  var tel           = frm.elements['tel'].value;
  var mobile        = frm.elements['mobile'].value;
  var sign_building = frm.elements['sign_building'].value;
  var best_time     = frm.elements['best_time'].value;

  if (id == 0)
  {
    layer.alert(current_ss_not_unshipped);
    return false;
  }
  var msg = '';
  if (address.length == 0)
  {
    msg += address_name_not_null + "</br>";
  }
  if (consignee.length == 0)
  {
    msg += consignee_not_null + "</br>";
  }

  if (msg.length > 0)
  {
    layer.alert(msg);
    return false;
  }
  else
  {
    return true;
  }
}

/* *
 * 会员余额申请
 */
function submitSurplus()
{
  var frm            = document.forms['formSurplus'];
  var surplus_type   = frm.elements['surplus_type'].value;
  var surplus_amount = frm.elements['amount'].value;
  var process_notic  = frm.elements['user_note'].value;
  var payment_id     = 0;
  var msg = '';

  if (surplus_amount.length == 0 )
  {
    msg += surplus_amount_empty + "</br>";
  }
  else
  {
    var reg = /^[\.0-9]+/;
    if ( ! reg.test(surplus_amount))
    {
      msg += surplus_amount_error + '</br>';
    }
  }

  if (process_notic.length == 0)
  {
    msg += process_desc + "</br>";
  }

  if (msg.length > 0)
  {
    layer.alert(msg);
    return false;
  }

  if (surplus_type == 0)
  {
    for (i = 0; i < frm.elements.length ; i ++)
    {
      if (frm.elements[i].name=="payment_id" && frm.elements[i].checked)
      {
        payment_id = frm.elements[i].value;
        break;
      }
    }

    if (payment_id == 0)
    {
      layer.alert(payment_empty);
      return false;
    }
  }

  return true;
}

/* *
 *  处理用户添加一个红包
 */
function addBonus()
{
  var frm      = document.forms['addBouns'];
  var bonus_sn = frm.elements['bonus_sn'].value;

  if (bonus_sn.length == 0)
  {
    layer.alert(bonus_sn_empty);
    return false;
  }
  else
  {
    var reg = /^[0-9]{10}$/;
    if ( ! reg.test(bonus_sn))
    {
      layer.alert(bonus_sn_error);
      return false;
    }
  }

  return true;
}

/* *
 *  合并订单检查
 */
function mergeOrder()
{
  if (!confirm(confirm_merge))
  {
    return false;
  }

  var frm        = document.forms['formOrder'];
  var from_order = frm.elements['from_order'].value;
  var to_order   = frm.elements['to_order'].value;
  var msg = '';

  if (from_order == 0)
  {
    msg += from_order_empty + '</br>';
  }
  if (to_order == 0)
  {
    msg += to_order_empty + '</br>';
  }
  else if (to_order == from_order)
  {
    msg += order_same + '</br>';
  }
  if (msg.length > 0)
  {
    layer.alert(msg);
    return false;
  }
  else
  {
    return true;
  }
}

/* *
 * 订单中的商品返回购物车
 * @param       int     orderId     订单号
 */
function returnToCart(orderId)
{
  Ajax.call('user.php?act=return_to_cart', 'order_id=' + orderId, returnToCartResponse, 'POST', 'JSON');
}

function returnToCartResponse(result)
{
  layer.alert(result.message);
}

/* *
 * 检测密码强度
 * @param       string     pwd     密码
 */
function checkIntensity(pwd)
{
  var Mcolor = "#FFF",Lcolor = "#FFF",Hcolor = "#FFF";
  var m=0;

  var Modes = 0;
  for (i=0; i<pwd.length; i++)
  {
    var charType = 0;
    var t = pwd.charCodeAt(i);
    if (t>=48 && t <=57)
    {
      charType = 1;
    }
    else if (t>=65 && t <=90)
    {
      charType = 2;
    }
    else if (t>=97 && t <=122)
      charType = 4;
    else
      charType = 4;
    Modes |= charType;
  }

  for (i=0;i<4;i++)
  {
    if (Modes & 1) m++;
      Modes>>>=1;
  }

  if (pwd.length<=4)
  {
    m = 1;
  }

  switch(m)
  {
    case 1 :
      Lcolor = "2px solid red";
      Mcolor = Hcolor = "2px solid #DADADA";
    break;
    case 2 :
      Mcolor = "2px solid #f90";
      Lcolor = Hcolor = "2px solid #DADADA";
    break;
    case 3 :
      Hcolor = "2px solid #3c0";
      Lcolor = Mcolor = "2px solid #DADADA";
    break;
    case 4 :
      Hcolor = "2px solid #3c0";
      Lcolor = Mcolor = "2px solid #DADADA";
    break;
    default :
      Hcolor = Mcolor = Lcolor = "";
    break;
  }
  if (document.getElementById("pwd_lower"))
  {
    document.getElementById("pwd_lower").style.borderBottom  = Lcolor;
    document.getElementById("pwd_middle").style.borderBottom = Mcolor;
    document.getElementById("pwd_high").style.borderBottom   = Hcolor;
  }


}

function changeType(obj)
{
  if (obj.getAttribute("min") && document.getElementById("ECS_AMOUNT"))
  {
    document.getElementById("ECS_AMOUNT").disabled = false;
    document.getElementById("ECS_AMOUNT").value = obj.getAttribute("min");
    if (document.getElementById("ECS_NOTICE") && obj.getAttribute("to") && obj.getAttribute('fee'))
    {
      var fee = parseInt(obj.getAttribute("fee"));
      var to = parseInt(obj.getAttribute("to"));
      if (fee < 0)
      {
        to = to + fee * 2;
      }
      document.getElementById("ECS_NOTICE").innerHTML = notice_result + to;
    }
  }
}

function calResult()
{
  var amount = document.getElementById("ECS_AMOUNT").value;
  var notice = document.getElementById("ECS_NOTICE");

  reg = /^\d+$/;
  if (!reg.test(amount))
  {
    notice.innerHTML = notice_not_int;
    return;
  }
  amount = parseInt(amount);
  var frm = document.forms['transform'];
  for(i=0; i < frm.elements['type'].length; i++)
  {
    if (frm.elements['type'][i].checked)
    {
      var min = parseInt(frm.elements['type'][i].getAttribute("min"));
      var to = parseInt(frm.elements['type'][i].getAttribute("to"));
      var fee = parseInt(frm.elements['type'][i].getAttribute("fee"));
      var result = 0;
      if (amount < min)
      {
        notice.innerHTML = notice_overflow + min;
        return;
      }

      if (fee > 0)
      {
        result = (amount - fee) * to / (min -fee);
      }
      else
      {
        //result = (amount + fee* min /(to+fee)) * (to + fee) / min ;
        result = amount * (to + fee) / min + fee;
      }

      notice.innerHTML = notice_result + parseInt(result + 0.5);
    }
  }
}
function is_zsxm()
{
  var username=document.getElementById("user_name").value;
	var unlen = username.replace(/[^\x00-\xff]/g, "**").length;
  var submit_disabled = false;
    if ( username == '' )
    {
        document.getElementById('zsxm').innerHTML = "真实姓名不能为空";
        submit_disabled = false;
    }

    else if ( !chkstr( username ))
    {
        document.getElementById('zsxm').innerHTML = msg_un_format;
        submit_disabled = false;
    }
    else if ( unlen < 3)
    {
       //alert(document.getElementById('zsxm'))
        document.getElementById('zsxm').innerHTML = "真实姓名不能少于两个汉字";
        submit_disabled = false;
    }
    else if ( unlen > 14 )
    {
        document.getElementById('zsxm').innerHTML = "真实姓名不能多于7个汉字";
        submit_disabled = false;
    }
   else
    {
      console.log(document.getElementById('zsxm'));
        document.getElementById('zsxm').innerHTML = "";
        submit_disabled = true;
    }
    return submit_disabled;


    //Ajax.call( 'user.php?act=is_zsxm', 'username=' + username, registed_callback , 'GET', 'TEXT', true, true );
}
function is_empty(){
  var submit_disabled = false;
  var text=document.getElementById('user_affiliation').value;
  if(text==""){
      document.querySelector('.empty').innerHTML = "输入内容不能为空";
      submit_disabled = false;
  }else{
      document.querySelector('.empty').innerHTML = "";
      submit_disabled = true;
  }
  return submit_disabled;
}
function is_empty1(){
  var submit_disabled = false;
  var text=document.getElementById('user_taxpayer_id').value;
  if(text==""){
      document.querySelector('.empty1').innerHTML = "输入内容不能为空";
      submit_disabled = false;
  }else{
      document.querySelector('.empty1').innerHTML = "";
      submit_disabled = true;
  }
  return submit_disabled;
}
function check_pi_phoneNum()
{
  var submit_disabled = false;
  var number = document.getElementById('user_mobile').value;
  if (number == '')
  {
    document.getElementById('pi_phoneNum_notice').innerHTML = msg_phone_blank;
    submit_disabled = false;
  }else if (!(/^1(3|4|5|7|8)\d{9}$/.test(number))) {
    document.getElementById('pi_phoneNum_notice').innerHTML = mobile_phone_invalid;
    submit_disabled = false;
  }else {
    document.getElementById('pi_phoneNum_notice').innerHTML = "";
    submit_disabled = true;
  }
  return submit_disabled;
}
function check_pi_gdphone (){
  var submit_disabled = false;
  num =  document.getElementById('user_phone').value;
  if (num == '')
  {
    document.getElementById('pi_gdphone_notice').innerHTML ="固定电话不能为空";
    submit_disabled = false;
  }
  else if(!(/^((0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/).test(num)){
    document.getElementById('pi_gdphone_notice').innerHTML = "输入和固定电话有误";
    submit_disabled = false;
  }else {
    document.getElementById('pi_gdphone_notice').innerHTML = "";
    submit_disabled = true;
  }
  return submit_disabled;
}
function check_pi_address(){
  var submit_disabled = false;
  var text=document.getElementById('user_address').value;
  if(text==""){
      document.getElementById('pi_accept_address').innerHTML = "输入内容不能为空";
      submit_disabled = false;
  }else{
      document.getElementById('pi_accept_address').innerHTML = "";
      submit_disabled = true;
  }
  return submit_disabled;
}
function check_pi_zs_xm(){
  var username=document.getElementById("user_pi_name").value;
  var unlen = username.replace(/[^\x00-\xff]/g, "**").length;
  var submit_disabled = false;
    if ( username == '' )
    {
        document.getElementById('pi_zs_xm').innerHTML = "真实姓名不能为空";
        submit_disabled = false;
    }

    else if ( !chkstr( username ))
    {
        document.getElementById('pi_zs_xm').innerHTML = msg_un_format;
        submit_disabled = false;
    }
    else if ( unlen < 3)
    {
       //alert(document.getElementById('zsxm'))
        document.getElementById('pi_zs_xm').innerHTML = "真实姓名不能少于两个汉字";
        submit_disabled = false;
    }
    else if ( unlen > 14 )
    {
        document.getElementById('pi_zs_xm').innerHTML = "真实姓名不能多于7个汉字";
        submit_disabled = false;
    }
   else
    {
        document.getElementById('pi_zs_xm').innerHTML = "";
        submit_disabled = true;
    }
    return submit_disabled;
}
function check_pi_zs_phone(){
  var submit_disabled = false;
  num =  document.getElementById('user_pi_phone').value;
  if (num == '')
  {
    document.getElementById('pi_zs_phone').innerHTML ="固定电话不能为空";
    submit_disabled = false;
  }
  else if(!(/^((0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/).test(num)){
    document.getElementById('pi_zs_phone').innerHTML = "输入和固定电话有误";
    submit_disabled = false;
  }else {
    document.getElementById('pi_zs_phone').innerHTML = "";
    submit_disabled = true;
  }
  return submit_disabled;
}
function check_pi_zs_email(){
  var submit_disabled = false;
  email =  document.getElementById('user_pi_email').value;
  if (email == '')
  {
    document.getElementById('pi_zs_email').innerHTML = msg_email_blank;
    submit_disabled = false;
  }
  else if (!Utils.isEmail(email))
  {
    document.getElementById('pi_zs_email').innerHTML = msg_email_format;
    submit_disabled = false;
  }

  else
  {
      document.getElementById('pi_zs_email').innerHTML="";
    submit_disabled = true;
  }
  return submit_disabled;
}
function checkpi() {
  var value  = $('input[name="ispi"]:checked').val();
  var frm = document.forms['formEditPi'];
  var username = frm.elements['extend_field7'].value;
  var unlen = username.replace(/[^\x00-\xff]/g, "**").length;
  //所在机构
  var jgmc = frm.elements['extend_field9'].value;
  var mobile = frm.elements['extend_field13'].value;
  //邮箱（固定电话字段当邮箱使用）
  var gddh = frm.elements['extend_field14'].value;
  var jgdz = frm.elements['extend_field11'].value;
  var pixm = frm.elements['extend_field16'].value;
  var pidh = frm.elements['extend_field17'].value;
  var piyx = frm.elements['extend_field18'].value;
  var msg = "";
  if (user_name == ""){
    msg += "真实姓名不能为空"+"</br>";
  }else if(unlen < 3){
    msg += "真实姓名不能少于两个汉字"+"</br>";
  }else if(unlen > 14){
    msg += "真实姓名不能多于七个汉字"+"</br>";
  }

  if(jgmc == ""){
    msg += "机构名称不能为空"+"</br>";
  }
  if(jgdz == ""){
    msg += "机构地址不能为空"+"</br>";
  }
  if(mobile == ""){
    msg += "移动电话不能为空"+"</br>";
  }else if(!(/^1(3|4|5|7|8)\d{9}$/.test(mobile))){
    msg += "请输入正确的手机号"+"</br>";
  }

  if (gddh == ''){
      msg += "邮箱不能为空"+"</br>";
  }else if (!Utils.isEmail(gddh))
  {
    msg += "请输入正确的邮箱"+"</br>";
  }
  if(value == "否"){
    if (pixm == ""){
      msg += "pi姓名不能为空"+"</br>";
    }else if(unlen < 3){
      msg += "pi姓名不能少于两个汉字"+"</br>";
    }else if(unlen > 14){
      msg += "pi姓名不能多于七个汉字"+"</br>";
    }

    if(pidh == ""){
      msg += "pi电话不能为空"+"</br>";
    }else if(!(/^1(3|4|5|7|8)\d{9}$/.test(pidh))){
      msg += "请输入正确的pi手机号"+"</br>";
    }

    if (piyx == ''){
        msg += "pi邮箱不能为空"+"</br>";
    }else if (!Utils.isEmail(piyx))
    {
      msg += "请输入正确的pi邮箱"+"</br>";
    }
  }
  if(msg.length > 0){
    layer.alert(msg);
  }else {
    Ajax.call('user.php?act=act_pi_certification',"&extend_field7="+username+"&extend_field9="+jgmc+"&extend_field13="+mobile+"&extend_field14="+gddh+"&extend_field11="+jgdz+"&extend_field16="+pixm+"&extend_field17="+pidh+"&extend_field18="+piyx, pirzReponse, 'POST', 'TEXT');

  }

  // if(value=="是"){
  //   check= is_zsxm()&&is_empty()&&is_empty1()&&check_pi_phoneNum()&&check_pi_gdphone()&&check_pi_address();
  // }else if(value=="否"){
  //   check= is_zsxm()&&is_empty()&&is_empty1()&&check_pi_phoneNum()&&check_pi_gdphone()&&check_pi_address()&&check_pi_zs_xm()&&check_pi_zs_phone()&&check_pi_zs_email();
  // }
}
 function pirzReponse(result){
   if(result == "true"){
     window.location.href = "user.php?act=pi_certification&step=2"
   }
 }
// 验证发票信息页面
// 验证发票抬头
function checkFptt(){
  var fptt = false;
  var text=document.getElementById('check_fptt').value;
  if(text==""){
      document.getElementById('is_fptt').innerHTML = "发票抬头不能为空";
      fptt = false;
  }else{
      document.getElementById('is_fptt').innerHTML = "";
      fptt = true;
  }
  return fptt;

}
// 验证纳税人识别号
function checkNsrsbh(){
  var taxpayerId = $("#check_nsrsbh").val();
  var nsrsbh = false;
  //纳税人识别号校验是否合法
  if($.trim(taxpayerId) == ''){
   document.getElementById('is_nsrsbh').innerHTML = "纳税人识别号不能为空";
   nsrsbh = false;
  }
  else if($.trim(taxpayerId).length==15|| $.trim(taxpayerId).length==18||$.trim(taxpayerId).length==20){
    var addressCode = taxpayerId.substring(0,6);
    // 校验地址码
    var check = checkAddressCode(addressCode);
    if(!check) {
      document.getElementById('is_nsrsbh').innerHTML ="请输入正确的纳税人识别号！";
     nsrsbh = false;
    }else{
     // 校验组织机构代码
     var orgCode = taxpayerId.substring(6,15);
     check = orgcodevalidate(orgCode);
     if(!check){
      document.getElementById('is_nsrsbh').innerHTML ="请输入正确的纳税人识别号！";
      nsrsbh = false;
    }else {
        document.getElementById('is_nsrsbh').innerHTML ="";
        nsrsbh = true;
    }
    }
  }else{
    document.getElementById('is_nsrsbh').innerHTML ="请输入正确的纳税人识别号！";
    nsrsbh = false;
  }
  return nsrsbh;
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
function invoice(){
  return checkFptt()&&checkNsrsbh();
}
//点击分享质粒的js
function sharedPlasmid(){
  Ajax.call( 'user.php?act=shared_plasmid', '', sharedResponse , 'GET', 'TEXT');
}
function sharedResponse(result){
  if(result == "false"){
    layer.alert("你还没有通过pi认证哦，请先完成pi认证再来分享质粒吧！",function(){
      window.location.href = "user.php?act=pi_certification";
    });
  }else{
    window.location.href = "user.php?act=shared_plasmid"
  }
}
window.onload = function(){
  layui.use('table', function(){
    var table = layui.table;
    //监听工具条
    table.on('tool(demo)', function(obj){
      var data = obj.data;
      if(obj.event === 'del'){
        layer.confirm('真的删除行么', function(index){
            Ajax.call('user.php?act=delete_plasmid',"&share_id="+data.share_id, deletePlasmidResponse, 'GET', 'TEXT');
            obj.del();
            layer.close(index);
        });
      } else if(obj.event === 'edit'){
        window.location.href = "/user.php?act=share_detial&plasmid_name="+obj.data.plasmid_name+"&step=1";
      }

      function deletePlasmidResponse(result){

      }

    });
    table.on('tool(demo1)', function(obj){
      var data = obj.data;
      if(obj.event === 'del'){
        layer.confirm('真的删除行么111', function(index){
            Ajax.call('user.php?act=delete_plasmid',"&share_id="+data.share_id, deletePlasmidResponse, 'GET', 'TEXT');
            obj.del();
            layer.close(index);
        });
      } else if(obj.event === 'sign'){
        if(data.examinestatus == "0"){
          layer.alert("此质粒信息正在审核中");
        }else {
          var share_id = data.share_id;
          var plasmid_name = data.plasmid_name;
          //调取协议
          Ajax.call('user.php?act=contract_share',"&share_id="+share_id+"&plasmid_name="+plasmid_name, contractPlasmidResponse, 'GET', 'TEXT');
        }
      }


      function deletePlasmidResponse(result){

      }
      function contractPlasmidResponse(result) {
        var result = JSON.parse(result);
        if(result=='error'){
          layer.alert("合同发起失败");
        }else{
          layer.open({
                  type: 2,
                  title: '质粒分享协议',
                  shadeClose: false,
                  shade: 0.8,
                  area:['70%','80%'],
                  content: result.contract_url ,//iframe的url
                  cancel: function(index){
                          Ajax.call('user.php?act=contract_share_status','&documentId='+result.contract_num+'&share_id='+result.share_id+'&contract_url='+result.contract_url, oneResponse, 'GET', 'TEXT');
                          }
                    });
        }
          function oneResponse(result){
            if(result == "signing"){
              layer.alert('签署失败,您可以到签署中的质粒中继续完成签署', {closeBtn : 0}, function(index){
                window.location.reload();
                layer.close(index);
              });
            }else{
              layer.alert('签署成功', {closeBtn : 0}, function(index){
                window.location.reload();
                layer.close(index);
              });
            }
          }
      }

    });
    table.on('tool(signagain)', function(obj){
      var data = obj.data;
      if(obj.event === 'signagain'){
        layer.open({
                    type: 2,
                    title: '质粒分享协议',
                    shadeClose: false,
                    shade: 0.8,
                    area:['70%','80%'],
                    content: data.contract_url ,//iframe的url
                    cancel: function(index){
                            Ajax.call('user.php?act=signagain','&contract_id='+data.contract_id+'&documentId='+data.contract_num, againResponse, 'GET', 'TEXT');
                            layer.close(index);
                          },

                  });
      }
      function againResponse(result) {
        if(result == "signing"){
          layer.alert('签署失败', {closeBtn : 0}, function(index){
            window.location.reload();
            layer.close(index);
          });
        }else{
          layer.alert('签署成功', {closeBtn : 0}, function(index){
            window.location.reload();
            layer.close(index);
          });
        }
      }
    });

    var $ = layui.$, active = {
      getCheckData: function(){ //获取选中数据
        var checkStatus = table.checkStatus('test')
        ,data = checkStatus.data;

        var Deldata = '';
        for (var i = 0; i < data.length; i++) {
          Deldata += data[i].share_id+',';
        }
        var num = Deldata.length-1;
        var Delshare_id = Deldata.substring(0,num);

        Ajax.call('user.php?act=delete_plasmid',"&Delshare_id="+Delshare_id, DeldataReponse, 'GET', 'TEXT');
          function DeldataReponse(result){ //获取选中数目
            if(result == 1){
              table.reload('test', {
                url: '/user.php?act=plasmid_data'
              });
            }
          }
      }
      ,applySharePlamsid:function(){
        var checkStatus = table.checkStatus('test')
        ,data = checkStatus.data;
        var sharedata =[];
        var j = 0;
        for (var i = 0; i < data.length; i++) {
          if(data[i].Information_integrity=="yes"){
            sharedata.push(data[i].share_id);
            j++;
          }
        }
        if(j==i){
          sharedata = JSON.stringify(sharedata);
          sharedata = sharedata.substring(1,sharedata.length-1);
          Ajax.call('user.php?act=apply_share',"&applyshare_id="+sharedata, shareDataReponse, 'GET', 'TEXT');
        }else{
          layer.alert("质粒信息不完善");
        }
        function shareDataReponse(result){
          if(result == "true"){
            layer.open({
                        type: 2,
                        title: '分享质粒邮寄须知',
                        btn: ['知道了'],
                        shadeClose: false,
                        closeBtn: 0,
                        shade: 0.8,
                        area: ['800px', '80%'],
                        content: 'international.php',
                        yes: function(index){
                          window.location.href = "/user.php?act=two_plasmid";
                          layer.close(index);
                        }
                      });
          }
        }
      }
      ,signAgreement: function(){ //获取选中数据
        var signAgreement = table.checkStatus('test1')
        ,data = signAgreement.data;
        // var Deldata = '';
        for (var i = 0; i < data.length; i++) {
          if(data[i].examinestatus == "0"){
            layer.alert("您的选择中含有未审核通过的质粒");
          }else{
            var share_id=[];
            var plasmid_name = [];
            for(var i = 0; i < data.length; i++){
              share_id.push(data[i].share_id);
              plasmid_name.push(data[i].plasmid_name);
            }
            Ajax.call('user.php?act=contract_share',"&share_id="+share_id+"&plasmid_name="+plasmid_name, contractArrResponse, 'GET', 'TEXT');
          }
        }
        function contractArrResponse(result) {
          var result = JSON.parse(result);
          if(result=='error'){
            layer.alert("合同发起失败");
          }else {
            layer.open({
                        type: 2,
                        title: '质粒分享协议',
                        shadeClose: false,
                        shade: 0.8,
                        area:['70%','80%'],
                        content: result.contract_url ,//iframe的url
                        cancel: function(index){
                                Ajax.call('user.php?act=contract_share_status','&documentId='+result.contract_num+'&share_id='+result.share_id+'&contract_url='+result.contract_url, oncecontResponse, 'GET', 'TEXT');
                                }
                      });
          }
        }
        function oncecontResponse(result) {

        }
      }
      ,youKnow:function(){
        layer.open({
                    type: 2,
                    title: '分享质粒邮寄须知',
                    btn: ['知道了'],
                    shadeClose: false,
                    shade: 0.8,
                    area: ['800px', '80%'],
                    content: 'international.php' ,//iframe的url
                    yes: function(index){
                      layer.close(index);
                    }
                  });
      }
      ,signplasmid:function(){
        layer.open({
                    type: 1,
                    title: '签署中的质粒',
                    shadeClose: false,
                    shade: 0.8,
                    area: ['600px', '60%'],
                    content: $('#waitsign') ,//iframe的url
                    yes: function(index){
                      layer.close(index);
                    }
                  });
      }
      ,reload: function(){
        var demoReload = $('#demoReload');
        table.reload('test', {
          url: '/user.php?act=plasmid_data'
          ,where: {
              share_name: demoReload.val()
          }
        });
      }
      ,reload1: function(){
        var demoReload1 = $('#demoReload1');
        table.reload('test1', {
          url: '/user.php?act=sign_data'
          ,where: {
              share_name1: demoReload1.val()
          }
        });
      }
    };

    $('.demoTable .layui-btn').on('click', function(){
      var type = $(this).data('type');
      active[type] ? active[type].call(this) : '';
    });
  });
}
