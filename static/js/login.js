var Login = function( dLogin ) {
    if ( ! dLogin ) return;
    this.$login = $( dLogin );
    this.ajaxSubmit();
};

Login.prototype.ajaxSubmit = function() {
    var _this = this;
    this.$login.delegate( ".js-btn-login", "click", function( e ) {
        var $btn  = $( this ),
            $form = $btn.closest( "form" );
        $btn.attr( "disabled", true );
        $form.ajaxSubmit( {
            data: { "ajax": 1 },
            success: function( txt ) {
                var res = $.parseJSON( txt );
                if ( res.status ) {
                    var currentUrl = window.location.href,
                        targetUrl  = res.info || U( "/" );
                    ( currentUrl.split( "#" )[0] === targetUrl.split( "#" )[0] ) ? window.location.reload() : ( window.location.href = targetUrl );
                } else {
                    _this.error( res.info );
                    $btn.attr( "disabled", false );
                }
            }
        } );
        return false;
    } );
};

Login.prototype.error = function( txt ) {
    ( null === txt ) || alertify.error( txt, 1500 );
};

// 登录的弹窗
Login.dialog = function( config ) {
    var defaultConfig = {
            ref: "",
            skipProfile: "",
            isWeiUser: "",
            openSiteId: ""
        },
        $body         = $( "body" ),
        $loginModal   = $( "#loginModal" ),
        _getHtml = function() {
            var html = '<div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="modal-label" aria-hidden="true">\
                            <div class="modal-dialog">\
                                <div class="modal-content">\
                                    <div class="modal-header">\
                                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">关闭</span></button>\
                                        <h4 class="modal-title">登录</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                        <form class="form-horizontal" action="/login?is_wei_user=' + ( config.isWeiUser || '' ) + '&ref=' + encodeURIComponent( config.ref || '' ) + '" method="post">\
                                            <input type="hidden" name="open_site_id" value="' + ( config.openSiteId || '' ) + '" />\
                                            <div class="form-group">\
                                                <label class="col-sm-2 control-label control-label-required">邮箱</label>\
                                                <div class="col-sm-10">\
                                                    <input class="form-control" type="email" name="email" value="" placeholder="" autocomplete="off"/>\
                                                </div>\
                                            </div>\
                                            <div class="form-group">\
                                                <label class="col-sm-2 control-label control-label-required">密码</label>\
                                                <div class="col-sm-10">\
                                                    <input class="form-control" type="password" name="password" value="" placeholder=""/>\
                                                </div>\
                                            </div>\
                                            <div class="form-group">\
                                                <label class="col-sm-2 control-label">&nbsp;</label>\
                                                <div class="col-sm-10">\
                                                    <a href="/password" class="pull-right">找回密码</a>\
                                                    <label><input type="checkbox" name="auto_login" value="1" checked="checked">&nbsp;下次自动登录</label>\
                                                </div>\
                                            </div>\
                                            <div class="form-group">\
                                                <label class="col-sm-2 control-label">&nbsp;</label>\
                                                <div class="col-sm-10 text-center">\
                                                    <button type="submit" class="btn btn-block btn-primary js-btn-login">登录</button>\
                                                </div>\
                                            </div>\
                                            <div class="form-group">\
                                                <label class="col-sm-2 control-label">&nbsp;</label>\
                                                <div class="col-sm-10 text-left">\
                                                    <p class="form-control-static">\
                                                        ' + ( config.isWeiUser
                                                            ? ( '<a href="/e/register?ref=' + encodeURIComponent( config.ref || '' ) + '&skip_profile=' + ( config.skipProfile || '' ) + '">注册账号</a>' )
                                                            : ( '<a href="/register?ref=' + encodeURIComponent( config.ref || '' ) + '&skip_profile=' + ( config.skipProfile || '' ) + '">注册账号</a>\
                                                            &nbsp;|&nbsp;\
                                                            <a href="/openLogin?ref=' + encodeURIComponent( config.ref || '' ) + '">微博登录</a>' ) ) + '\
                                                    </p>\
                                                </div>\
                                            </div>\
                                        </form>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>';
            return html;
        };

    config = $.extend( defaultConfig, config );

    $loginModal.remove();
    $body.append( _getHtml() );
    $loginModal = $( "#loginModal" );

    new Login( $loginModal[0] );
    $loginModal.modal( "show" );
};

// 登录的弹窗按钮
Login.initDialogBtn = function() {
    $( ".js-login-dialog-btn" ).click( function() {
        var ref = $( this ).data( "ref" ) || window.location.href;
        Login.dialog( {
            ref: ref
        } );
        return false;
    } );
};

$(function(){
    // 只有未登录状态下才初始化登录弹窗按钮
    UID || Login.initDialogBtn();
});
