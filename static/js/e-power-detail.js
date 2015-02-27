$( function() {
    var EPowerDetail = function() {
            this.$body  = $( "body" );
            this.$fade  = $( "<div/>" );
            this.$container = $( "<div/>" );
            this.$mobile = $( "<div/>" );
            this.$iframe = $( "<iframe/>" );
            this.$qrcode = $( "<div/>" );
            this.$tips   = $( "<div/>" );
            this.$closeBtn = $( '<a class="btn" href="javascript:;"></a>' ),
            this.init();
        };

    EPowerDetail.prototype = {
        constructor: EPowerDetail,
        init: function() {
            this.initFade();
            this.initContainer();
            this.initMobile();
            this.initIframe();
            this.initTips();
            this.initQrcode();
            this.initBtn();
        },
        initFade: function() {
            var $fade = this.$fade;
            $fade.attr( "style", "width: 100%;height: 100%;box-sizing: border-box;visible: visible;position: fixed;top: 0;left: 0;right: 0;bottom: 0;background-color: #000;opacity: .5;filter: alpha(opacity=50);z-index: 1540;" );
            $fade.hide();
            this.$body.append( $fade );
        },
        initContainer: function() {
            var $container = this.$container;
            $container.attr( "style", "overflow: visible;position: absolute;top: 100px;bottom: 0;right: 0;z-index: 1650;" );
            $container.css( "width", 600 );
            $container.css( "height", 632 );
            $container.css( "left", ( $( document ).width() - $container.width() ) / 2 + 100 );
            $container.hide();
            this.$body.append( $container );
        },
        initMobile: function() {
            var $mobile = this.$mobile;
            $mobile.attr( "style", "-webkit-border-radius:34px;-moz-border-radius:34px;border-radius:34px;overflow: hidden;position: absolute;top: 0;left: 0;bottom: 0;right: 0;" );
            $mobile.css( "width", 287 );
            $mobile.css( "height", 632 );
            this.$container.append( $mobile );
        },
        initIframe: function() {
            var $iframe = this.$iframe;
            $iframe.attr( "frameborder", 0 )
                .attr( "scrolling", "no" )
                .css( "width", 294 )
                .css( "height", 632 )
                .css( "margin-left", -6 )
                .attr( "src", MOBILE_HOME_PAGE + U( '/e/' + UID + '/power', {} ) );
            this.$mobile.append( $iframe );
        },
        initTips: function() {
            var $tips = this.$tips;
            $tips.attr( "style", "display:block;width:400px;color:#fff;font-weight:100;position:absolute;left:310px;top:72px;z-index:2002" );
            $tips.html( '<p class="">hi，' + USER.alias + '！</p>\
                <p>\
                    由于最近你的炫酷表现，特献上以下招聘法宝：<span class="text-highlight">指尖幻灯片</span>，可以把亲的招聘信息以酷炫狂拽叼炸天的流行手机页面效果分享到朋友圈，招人不再难！不客气~\
                </p>' );
            this.$container.append( $tips );
        },
        initQrcode: function() {
            var $qrcode = this.$qrcode;
            $qrcode.attr( "style", "width:178px;height:226px;overflow:hidden;color:#666;text-align:center;position:absolute;left:410px;top:200px;" );
            $qrcode.html( '<p style="line-height:22px;-webkit-border-radius:5px 5px 0 0;-moz-border-radius:5px 5px 0 0;border-radius:5px 5px 0 0;background-clip:padding-box;margin:0;font-size:12px;font-weight:700;border:1px solid #e4e4e4;padding:8px 10px;background-color:#f2f2f2;">微信“扫一扫”分享朋友圈</p>\
                <p style="display:block;height:162px;background-color:#fff;padding-top:4px;margin:0;-webkit-border-radius:0 0 5px 5px;-moz-border-radius:0 0 5px 5px;border-radius:0 0 5px 5px;">\
                    <img width="158" height="158" src="http://s.jiathis.com/qrcode.php?url=' + encodeURIComponent( MOBILE_HOME_PAGE + U( '/e/' + UID + '/power', {} ) ) + '">\
                </p>' );
            this.$container.append( $qrcode );
        },
        initBtn: function() {
            var _this = this,
                $closeBtn = this.$closeBtn;
            // close btn
            $closeBtn.attr( "style", "display:block;position:absolute;top:0;right:-80px;z-index:2012" );
            $closeBtn.append( "<img/>" ).find( "img" ).attr( "src", "/Index/Tpl/Public/images/guide/close.png?v201501141232" );
            $closeBtn.bind( "click", function() {
                _this.hide();
            } );
            // append
            this.$container.append( $closeBtn );
        },
        show: function() {
            this.$fade.show();
            this.$container.show();
        },
        hide: function() {
            var $fade      = this.$fade,
                $container = this.$container,
                $mobile    = this.$mobile,
                $iframe    = this.$iframe,
                $qrcode    = this.$qrcode,
                $tips      = this.$tips,
                $closeBtn  = this.$closeBtn,
                dContainer = $container[0],
                $targetBtn = $( ".sidebar-menu > ul > li:first" ),
                $subTargetBtn = $( $( ".container-nav-tabs-2 > .nav-tabs-2 > li" )[2] ),
                currentWidth  = $container.width(),
                currentHeight = $container.height(),
                currentTop    = $container.offset().top,
                currentLeft   = $container.offset().left,
                targetTop      = $targetBtn.offset().top + Math.floor( $targetBtn.height() / 2 ),
                targetLeft     = $targetBtn.offset().left + Math.floor( $targetBtn.width() / 2 ),
                duration = 3000,
                execTime = 0,
                delay     = 3000,
                frameTime = 10,
                fZoomOut = function() {
                    execTime += frameTime;
                    currentWidth  = Math.floor( currentWidth * ( 1 - execTime / duration ) );
                    currentHeight = Math.floor( currentHeight * ( 1 - execTime / duration ) );
                    dContainer.style.width  = currentWidth + "px";
                    dContainer.style.height = currentHeight + "px";
                    currentTop  = $container.offset().top;
                    currentLeft = $container.offset().left;
                    currentTop    = Math.floor( currentTop + ( targetTop - currentTop ) * ( execTime / duration ) );
                    currentLeft   = Math.floor( currentLeft + ( targetLeft - currentLeft ) * ( execTime / duration ) );
                    dContainer.style.top  = currentTop + "px";
                    dContainer.style.left = currentLeft + "px";
                    if ( ( execTime >= duration - frameTime ) || ( currentWidth < 10 ) ) {
                        $container.hide();
                         // 渲染图标的动画效果
                        var $velocity;
                        for ( var i = 0, l = 10; i < l; ++ i) {
                            if ( 0 === i ) {
                              $velocity = $targetBtn.find( "i" ).velocity({rotateZ: "20deg"},  {delay:500, duration:90});
                            } else {
                              $velocity = $velocity.velocity({rotateZ: "20deg"},  {delay:500, duration:90});
                            }
                            for ( var j = 0, k = 11; j < k; ++ j ) {
                              $velocity.velocity({rotateZ: ( j % 2 === 0 ? "-" : "" ) + "20deg"}, {duration:90});
                            }
                            $velocity.velocity({rotateZ: "0deg"},   {duration:90});
                        }
                        if ( location.href.match( /e\/admin\/center/ ) || location.href.match( /e\/admin\/invite/ ) ) {
                            for ( var i = 0, l = 10; i < l; ++ i) {
                                if ( 0 === i ) {
                                  $velocity = $subTargetBtn.find( "a" ).velocity({rotateZ: "20deg"},  {delay:500, duration:90});
                                } else {
                                  $velocity = $velocity.velocity({rotateZ: "20deg"},  {delay:500, duration:90});
                                }
                                for ( var j = 0, k = 11; j < k; ++ j ) {
                                  $velocity.velocity({rotateZ: ( j % 2 === 0 ? "-" : "" ) + "20deg"}, {duration:90});
                                }
                                $velocity.velocity({rotateZ: "0deg"},   {duration:90});
                            }
                        }
                    } else {
                        setTimeout( fZoomOut, frameTime );
                    }
                }
            $mobile.css( "width", "47%" );
            $mobile.css( "height", "100%" );
            $iframe.css( "width", "100%" );
            $iframe.css( "height", "100%" );
            $qrcode.hide();
            $tips.hide();
            $closeBtn.hide();
            setTimeout( fZoomOut, frameTime );
            $fade.fadeOut( duration / 2 );
        }
    };

    if ( ! $.cookie( "EPowerDetail_is_showed" + UID ) && ! location.href.match( /e\/admin\/power/ ) ) {
        var newEPowerDetail = new EPowerDetail();
        newEPowerDetail.show();
        $.cookie( "EPowerDetail_is_showed" + UID, 1 );
    }
} );