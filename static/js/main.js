;(function($){
   var height = $(window).height() - 180;
   $("#main_content").css({
    'min-height': height + "px"
   });

})(jQuery);

(function($){
    var wait = 5;
    function time(o){
        if (wait == 0) {
            o.removeAttr("disabled");
            o.text("再次获取验证码");
            wait = 5;
            }
        else {
            o.attr("disabled", true);
            o.text("发送(" + wait + ")");
            wait--;
            setTimeout(function() { time(o)}, 1000)
        }
    }

    $("#verify_code_send").click(function(){
        var phone = $("#phone").val();
        $.ajax({
            url: '/user/phone',
            data: {phone: phone},
        })
        .done(function() {
            console.log("success");
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });
        time($(this));

    })
})(jQuery);
