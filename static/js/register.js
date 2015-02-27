function registerFormError( txt ) {
    ( null === txt ) || alertify.error( txt, 1500 );
}

var registerAjaxSubmitOption = {
    data: { ajax: 1 },
    beforeSubmit: function() {
        $('#submit-btn').attr('disabled', 'disabled').val('提交中...');
        return true;
    },
    success: function(txt) {
        var res = $.parseJSON(txt);
        if (res.status) {
            var role = $('#role').val() == 'wei_user' ? 'WeiUser' : 'User';
            ga('send', {
                'hitType': 'event',
                'eventCategory': role,
                'eventAction': 'register',
                'eventLabel': role + ' Register',
                'hitCallback': function() {
                    window.location.href = res.info || U( "/" );
                }
            });
        }else {
            registerChangeVerify();
            $('#submit-btn').removeAttr('disabled').val('注册');
            registerFormError(res.info);
        }
    }
}

function registerSubmitForm() {
    alertify.set({
        labels: {
            ok     : "确定",
            cancel : "取消"
        }
    })
    
    var role = $('#role').val();
    
    var o_alias       = $('#alias');
    var o_email       = $('#email');
    var o_password    = $('#password');
    var o_re_password = $('#re_password');
    
    o_alias.val($.trim(o_alias.val()));
    o_email.val($.trim(o_email.val()));
    
    if (role == 'user' && !o_alias.val()) {
        alertify.error( '请输入昵称', 1500 );
        o_alias.focus();
        return ;
    }
    if (!o_email.val()) {
        alertify.error('请输入邮箱', 1500 );
        o_email.focus();
        return ;
    }
    if (!o_password.val()) {
        alertify.error('请输入密码', 1500 );
        o_password.focus();
        return ;
    }
    if (o_password.val() !== o_re_password.val()) {
        alertify.error('两次输入的密码不一致', 1500 );
        o_password.focus();
        return ;
    }
    
    if (role == 'user') {
        $('#form').ajaxSubmit( registerAjaxSubmitOption );
        
    }else if (role == 'wei_user') {
        var email  = o_email.val().split('@');
        var domain = ['qq.com', 'vip.qq.com', '163.com', '126.com', 'gmail.com', 'vip.sina.com', 'sina.com', 'sina.com.cn', 'sina.cn', 'sohu.com', 'hotmail.com', 'yahoo.com', 'live.cn'];
        if ($.inArray(email[1], domain) >= 0) {
            alertify.set({
                labels: {
                    ok     : "确定继续",
                    cancel : "返回修改"
                },
                buttonFocus: "cancel"
            });
            alertify.confirm( "建议您使用企业域名邮箱注册，比个人邮箱更容易受到求职者的青睐哦~", function (e) {
                if (e) {
                    $('#form').ajaxSubmit( registerAjaxSubmitOption );
                }else {
                    o_email.focus();
                }
            } );
        }else {
            $('#form').ajaxSubmit( registerAjaxSubmitOption );
        }
    }
}

function registerChangeVerify() {
    var date = new Date();
    var time = date.getTime();
    $("#verifyImg").attr("src", U( "/Index/verify/" + time ));
}

$('input, textarea').placeholder();

$( "#form" ).find( ".js-verify-code" ).click( registerChangeVerify );

$( "#submit-btn" ).click( function(){
    registerSubmitForm();
    return false;
} );
