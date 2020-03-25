$(":button").click(function(){
  layer.confirm('<h1>请在支付页面上完成付款！</h1><br><p style="color:#999;font-size:12px;">付款完成前请不要关闭此窗口。付款完成后请根据情况点击一下按钮。</p>', {
    btn: ['已完成付款','付款遇到问题'] //按钮
    ,title: false
    ,closeBtn: 0
  }, function(index){
      Ajax.call('flow.php?step=payment_code','&WIDout_trade_no='+{$trade_no}+'&order_id='+{$order.order_id}, Response, 'POST', 'text');
    //  console.log('flow.php?step=payment_code','WIDout_trade_no='+{$trade_no}+'&mobile='+{$order.mobile});
      layer.close(index)
  }, function(){

  });

});
function Response(result) {
  var layer = document.getElementById("ECS_SUCCESS");
  layer.innerHTML = result;
  var obj = document.createElement('div');
  obj.innerHTML=result;
  var ele = obj.querySelectorAll(".xqy");
  console.log(ele);

}
$(document).ready(function(e) {
  var counter = 0;
  if (window.history && window.history.pushState) {
      $(window).on('popstate', function () {
                    window.history.pushState('forward', null, '#');
                    window.history.forward(1);
                    window.location.href="/flow.php?step=checkout";
        });
    }

    window.history.pushState('forward', null, '#'); //在IE中必须得有这两行
    window.history.forward(1);
});
