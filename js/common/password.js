Utils.isEmail = function( email )
{
  var reg1 = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)/;

  return reg1.test( email );
}

function get_mail_code() {
	var frm  = document.forms['getPassword'];
	var email_code  = Utils.trim(frm.elements["email_code"].value);
	//var user_name  = Utils.trim(frm.elements['user_name'].value);
  	var email = Utils.trim(frm.elements['email'].value);
	if(email == '') {
		layer.alert("邮箱不能为空！");
		$("email_code").focus();
		return;
	}
	if ( ! (Utils.isEmail(email))){
		layer.alert("邮箱格式不对！");
		$("email_code").focus();
		return;
	}
	// if(user_name == '') {
	// 	layer.alert("用户名不能为空！");
	// 	$("user_name").focus();
	// 	return;
	// }
	// layer.alert('user.php?step=user_name='+user_name+"&email="+email);
	// Ajax.call('sms.php?step=getverifycode1&r=' + Math.random(), 'mobile=' + mobile+'&smscode=' + smscode, getverifycode1Response, 'POST', 'JSON');
  console.log('sms.php?step=email_code',"&email="+email);
	Ajax.call('sms.php?step=email_code',"&email="+email, get_mail_codeResponse, 'POST', 'TEXT');
}


var ztime = 120;//倒计时
var iTime = parseInt(ztime)-1;
var Account;

function get_mail_codeResponse(result) {
	//console.log(result);
	RemainTime();
  if(result=="0"){
    layer.alert("验证码发送成功,如果没收到请看看垃圾箱哦");
  }else if(result=="1"){
    layer.alert("您输入的邮箱不存在",{closeBtn: 0},function(){
      window.location.reload();
    });
  }

}




function RemainTime(){
	document.getElementById('zphone').disabled = true;
	var iSecond,sTime="";
	if (iTime >= 0){
		iSecond = parseInt(iTime%60);
		iMinute = parseInt(iTime/60)
		if (iSecond >= 0){
			if(iMinute>0){
				sSecond = iMinute + "分" + iSecond + "秒";
			}else{
				sSecond = iSecond + "秒";
			}
		}
		sTime=sSecond;
		if(iTime==0){
			clearTimeout(Account);
			if(smsyy==-1 || parseInt(smsyy)>0){
				sTime ="获取短信验证码";
			}else{
				sTime ="获取语音验证码";
			}


			iTime = parseInt(ztime)-1;
			document.getElementById('zphone').disabled = false;
		}else{
			Account = setTimeout("RemainTime()",1000);
			iTime=iTime-1;
		}
	}else{
		sTime='没有倒计时';
	}
	document.getElementById('zphone').value = sTime;
}
