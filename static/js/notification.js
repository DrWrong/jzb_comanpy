var Notification = Notification || {};

Notification.unread = {
    init: function() {
        this.loading();
    },
    url: {
        "user": "/UserNotification/getUnreadNotificationCount",
        "wei_user": "/WeiUserAdminNotification/getUnreadNotificationCount"
    },
    refreshTime: 30000,
    refreshTimer: undefined,
    flagClass: "notifier-number",
    cache: {},
    isLoading: false,
    loading: function() {
        var _this = this;
        if ( this.isLoading ) {
            return ;
        }
        this.isLoading = true;
        clearTimeout( this.refreshTimer );
        $.get( _this.url[ROLE], {}, function(txt){
            var res = $.parseJSON( txt );
            if ( res.status ) {
                _this.cache = res.info;
                _this.show();
            }

            _this.isLoading = false;
            _this.refreshTimer = setTimeout( function() {
                _this.loading();
            }, _this.refreshTime );
        } );
    },
    show: function() {
        var _this = this,
            $tips = $( "#notification-tips" ),
            $dropBtn = $tips.find( ".js-drop-btn" ),
            $tabBtns = $tips.find( ".js-tab-btn" ),
            numberAttr = "data-notifier-number",
            cache = this.cache;
        $tabBtns.each( function( i, n ) {
            var $n = $( n ),
                type = $n.data( "type" );
            cache[type] > 0 ? $n.addClass( _this.flagClass ) : $n.removeClass( _this.flagClass );
            $n.attr( numberAttr, cache[type] < 100 ? cache[type] : "..." );
        } );
        cache['total'] > 0 ? $dropBtn.addClass( _this.flagClass ) : $dropBtn.removeClass( _this.flagClass );
        $dropBtn.attr( numberAttr, cache['total'] < 100 ? cache['total'] : "..." );
    },
    reset: function( type ) {
        var cache = this.cache;
        if ( type ) {
            cache["total"] -= cache[type];
            cache[type] = 0;
        } else {
            for ( i in this.cache ) {
                if ( "total" != i ) {
                    cache["total"] -= cache[i];
                    cache[type] = 0;
                }
            }
        }
        this.show();
    },
    hasNew: function( type ) {
        return ( this.cache[type || "total"] || 0 ) > 0;
    }
};

Notification.list = {
    url: {
        "user" : "/UserNotification/getNotificationList",
        "wei_user": "/WeiUserAdminNotification/getNotificationList"
    },
    rowUnreadClass: "active",
    initTips: function() {
        var _this = this,
            $tips = $( "#notification-tips" ),
            selectedClass = "active",
            isTypeLoading = {},
            isTypeLoaded = {},
            fLoading = function( type ) {
                if ( isTypeLoading[type] || isTypeLoaded[type] ) {
                    return ;
                }
                isTypeLoading[type] = true;
                var $list = $tips.find( ".js-list-" + type );
                $list.html( '<li class="list-group-item text-center"><i class="fa fa-circle-o-notch fa-spin"></i></li>' );
                _this.loading( { type: type, limit: 20, tpl: "simple" }, function( info ) {
                    $list.html( info.data || '<li class="list-group-item text-center">暂时木有此类通知</li>' );
                    isTypeLoading[type] = false;
                    isTypeLoaded[type] = true;
                } );
            };
        // 保证在 js-drop-box 内部的点击事件不会关闭 js-drop-box
        $tips.find( ".js-drop-box" ).click(function( e ) {
            e.stopPropagation();
        });
        // 保证滚动通知列表时，外部结构不被滚动
        $tips.find( ".js-drop-content" ).bind('mousewheel DOMMouseScroll', function (e) {
            var scrollTo = null;

            if (e.type == 'mousewheel') {
                scrollTo = (e.originalEvent.wheelDelta * -1);
            }else if (e.type == 'DOMMouseScroll') {
                scrollTo = 40 * e.originalEvent.detail;
            }

            if (scrollTo) {
                e.preventDefault();
                $(this).scrollTop(scrollTo + $(this).scrollTop());
            }
        });
        // 展现点击
        $tips.find( ".js-drop-btn" ).click( function() {
            var $tabList = $tips.find( ".js-tab-list" ),
                $activeTab = $tabList.find( ".js-tab." + selectedClass ),
                $firstNotifiedBtn = $tabList.find( ".js-tab-btn." + Notification.unread.flagClass + ":first" );
            // 优先识别是否有激活的按钮
            // 其次识别是否有未读消息的按钮
            // 否则默认自动点击第一个按钮
            $activeTab.length > 0
                ? $activeTab.find( ".js-tab-btn" ).click()
                : $firstNotifiedBtn.length > 0
                    ? $firstNotifiedBtn.click()
                    : $tabList.find( ".js-tab-btn:first" ).click();
        } );
        // tab 点击
        $tips.find( ".js-tab-btn" ).click( function( e ) {
            e.preventDefault();
            var $btn = $( this ),
                type = $btn.data( "type" );
            // tab 切换
            $btn.tab( "show" );
            // Tab组件默认会莫名其妙地将父元素置为 .active，
            // 此处修正该问题，以确保 js-drop-box 关闭时，父元素也移除选中状态
            $( "#notification-tips" ).removeClass( "active" );
            // 若某类通知有新的消息，强制重置为未加载
            Notification.unread.hasNew( type ) && ( isTypeLoaded[type] = false );
            // 加载内容
            fLoading( type );
            // 重置未读统计
            Notification.unread.reset( type );
        } );
        // 消息点击
        $tips.find( ".js-drop-content" ).delegate( ".js-row", "click", function( e ) {
            var $row = $( this );
            $row.removeClass( _this.rowUnreadClass );
        } );
        // 点击全部
        $tips.find( ".js-more-btn" ).click( function() {
            $tips.find( ".js-drop-content .js-row" ).removeClass( _this.rowUnreadClass );
        } );
    },
    initCenter: function() {
        var _this = this,
            $list = $( "#notification-center-list" ),
            $more = $( "#notification-center-more" ),
            moreBtnText = $more.html(),
            moreLoadingText = $more.data( "loading-text" ),
            hiddenClass = "hidden",
            nextQuery = {
                start: $list.data( "next" ) || "",
                limit: 20,
                tpl: "by_time"
            },
            isLoading = false,
            fLoading = function() {
                if ( isLoading ) {
                    return ;
                }
                isLoading = true;
                $more.html( moreLoadingText );
                _this.loading( nextQuery, function( info ) {
                    $list.append( info.data );
                    nextQuery.start = info.next;
                    nextQuery.start > 0 ? $more.removeClass( hiddenClass ) : $more.addClass( hiddenClass );
                    $more.html( moreBtnText );
                    isLoading = false;
                } );
            };
        // 消息点击
        $list.delegate( ".js-row", "click", function( e ) {
            var $row = $( this );
            $row.removeClass( _this.rowUnreadClass );
        } );
        // more 点击
        $more.bind( "click", fLoading );
        // 触发加载后重置未读统计
        $more.length && Notification.unread.reset();
    },
    loading: function( query, cb ) {
        $.get( this.url[ROLE], query || {}, function(txt){
            var res = $.parseJSON( txt );
            if ( res.status ) {
                cb && cb( res.info );
            }
        } );
    }
};

// 只有登录状态下才处理
$(function(){
    ROLE && Notification.unread.init();
    ROLE && Notification.list.initTips();
});
