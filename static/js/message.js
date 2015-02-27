var Message = Message || {};

Message.unread = {
    init: function() {
        this.loading();
    },
    url: "/Message/getMemberUnreadCount",
    refreshTime: 30000,
    refreshTimer: undefined,
    count: 0,
    isLoading: false,
    loading: function() {
        var _this = this;
        if ( this.isLoading ) {
            return ;
        }
        this.isLoading = true;
        clearTimeout( this.refreshTimer );
        $.get( _this.url, {}, function(txt){
            var res = $.parseJSON( txt );
            if ( res.status ) {
                _this.count = res.info;
                _this.show();
            }

            _this.isLoading = false;
            _this.refreshTimer = setTimeout( function() {
                _this.loading();
            }, _this.refreshTime );
        } );
    },
    show: function() {
        var $tips = $( "#message-tips" ),
            $btn  = $tips.find( "a" ),
            numberAttr = "data-notifier-number";
        $btn.attr( numberAttr, this.count < 100 ? this.count : "..." );
    }
};

Message.list = {
    init: function() {
        var _this = this,
            $list = $( "#message-list" );
        $list.delegate( ".js-row", "click", function( e ) {
            if ( e.target.nodeName != 'A' ) {
                window.location.href = $( this ).closest( ".js-row" ).find( "a.js-dialogue-btn" ).attr( "href" );
            }
        } );
        $list.delegate( "a.js-delete-btn", "click", function() {
            var $btn = $( this ),
                url = $btn.attr( "href" ),
                dialogueId = $btn.data( "dialogue-id" ),
                receivers  = $btn.data( "receivers" );
            alertify.confirm( "确定要删除与 " + receivers + " 的全部私信会话", function( isOk ) {
                if ( ! isOk ) {
                    return ;
                }
                $.get( url, {}, function( res ) {
                    res = $.parseJSON( res );
                    if ( res.status ) {
                        alertify.success( res.info );
                        _this.removeRow( dialogueId );
                    } else {
                        alertify.error( res.info, 2000 );
                    }
                } );
            } );
            return false;
        } );
    },
    removeRow: function( dialogueId ) {
        $( "#dialogue-" + dialogueId ).remove();
    },
    refreshRow: function( dialogueId ) {
        var $dialogue = $( "#dialogue-" + dialogueId );
        $.get( "/Message/getDialogueListRow", { id: dialogueId }, function( res ) {
            res = $.parseJSON( res );
            if ( res.status ) {
                if ( $dialogue.hasClass( "active" ) ) {
                    $dialogue.removeClass( "active" );
                    Message.unread.loading();
                }
                $dialogue.html( res.info );
            }
        } );
    }
};

Message.dialogue = {
    url: "/Message/getFloorList",
    hiddenClass: "hidden",
    refreshTime: 4000,
    refreshTimer: undefined,
    pageTitleFlash: true,
    dialogueId: "",
    from: "",
    to: "",
    next: "",
    serverTime: 0,
    init: function() {
        var _this = this,
            $floorList = $( "#dialogue-floor-list" ),
            $moreBtn = $( "#dialogue-floor-more" );
        // init params
        this.dialogueId = $floorList.data( "dialogue-id" );
        this.from = $floorList.data( "from" );
        this.to = $floorList.data( "to" );
        this.next = $floorList.data( "next" );
        this.serverTime = + $floorList.data( "time" );
        // more 点击
        $moreBtn.bind( "click", function() {
            _this.loadingMore();
            return false;
        } );
        // new 刷新
        this.refreshTimer = setTimeout( function() {
            _this.pageTitleFlash = true;
            _this.loadingNew();
        }, this.refreshTime );
        // 初始化消息提醒
        this.flash.init();
        // 时间更新
        setInterval( function() {
            _this.updateFloorsTime();
        }, 60000 );
    },
    loadingMore: function() {
        var _this = this,
            $floorList = $( "#dialogue-floor-list" ),
            $moreBtn = $( "#dialogue-floor-more" ),
            moreBtnText = $moreBtn.html(),
            moreLoadingText = $moreBtn.data( "loading-text" );
        if ( this.isLoadingMore ) {
            return ;
        }
        this.isLoadingMore = true;
        $moreBtn.html( moreLoadingText );
        this.loading( {
            dialogue_id: this.dialogueId,
            after: this.to,
            limit: 20
        }, function( info ) {
            $floorList.append( info.data );
            _this.to = info.to || _this.to;
            _this.next = info.next;
            info.next > 0 ? $moreBtn.removeClass( _this.hiddenClass ) : $moreBtn.addClass( _this.hiddenClass );
            $moreBtn.html( moreBtnText );
            _this.isLoadingMore = false;
        } );
    },
    loadingNew: function() {
        var _this = this,
            $floorList = $( "#dialogue-floor-list" );
        if ( this.isLoadingNew ) {
            return ;
        }
        this.isLoadingNew = true;
        clearTimeout( _this.refreshTimer );
        this.loading( {
            dialogue_id: this.dialogueId,
            before: this.from,
            limit: 200
        }, function( info ) {
            if ( info.from ) {
                $floorList.prepend( info.data );
                _this.from = info.from;
                _this.pageTitleFlash && _this.flash.start();
                Message.unread.loading();
            }
            _this.serverTime = info.time;
            _this.isLoadingNew = false;

            _this.refreshTimer = setTimeout( function() {
                _this.pageTitleFlash = true;
                _this.loadingNew();
            }, _this.refreshTime );
        } );

    },
    loading: function( query, cb ) {
        $.get( this.url, query || {}, function(txt){
            var res = $.parseJSON( txt );
            if ( res.status ) {
                cb && cb( res.info );
            }
        } );
    },
    updateFloorsTime: function() {
        var $floorList = $( "#dialogue-floor-list" ),
            $floorsTime = $floorList.find( ".js-time" ),
            serverTime = this.serverTime;
        $floorsTime.each( function( i, n ) {
            var $floorTime = $( n ),
                time = + $floorTime.data( "time" ),
                diff = serverTime - time;
            if ( diff < 0 ) {
                // do nothing
            } else if ( diff < 60 ) {
                $floorTime.html( "刚刚" );
            } else if ( diff < 3600 ) {
                $floorTime.html( Math.floor( diff / 60 ) + "分钟前" );
            } else if ( diff < 86400 ) {
                $floorTime.html( Math.floor( diff / 3600 ) + "小时前" );
            }
        } );
    },
    flash: {
        title: "",
        flashText: [ "【新消息】", "【　　　】" ],
        flashInterval: 500,
        flashTimer: undefined,
        _fBodyMouseOver: undefined,
        init: function() {
            var _this = this,
                $document = $( document );
            this.title = $document.find( "title" ).html();
            this._fBodyMouseOver = function() {
                $( this ).unbind( "mouseover", _this._fBodyMouseOver );
                _this.stop();
            };
        },
        start: function() {
            var _this = this,
                $document = $( document ),
                $title = $document.find( "title" ),
                textIndex = 0,
                fFlash = function() {
                    textIndex = textIndex ? 0 : 1;
                    $title.html( _this.flashText[textIndex] + _this.title );
                    _this.flashTimer = setTimeout( fFlash, _this.flashInterval );
                };
            clearTimeout( this.flashTimer );
            this.flashTimer = setTimeout( fFlash, this.flashInterval );
            $document.find( "body" ).bind( "mouseover", this._fBodyMouseOver );
        },
        stop: function() {
            var $document = $( document ),
                $title = $document.find( "title" );
            clearTimeout( this.flashTimer );
            $title.html( this.title );
        }
    }
};

Message.send = {
    initBtn: function() {
        $('body').on('click', '.js-message-btn', function() {
            // 登录验证
            if ( ! UID ) {
                Login.dialog( {
                    ref: window.location.href
                } );
                return false;
            }
            var $btn = $( this ),
                $sendDialog = $( "#message-send-dialog" ),
                dialogueId = $btn.data( "dialogue-id" ) || "",
                toRole = $btn.data( "to-role" ) || "",
                toUid  = $btn.data( "to-uid" ) || "",
                receivers = $btn.data( "receivers" );
            $sendDialog.find( "input[name=dialogue_id]" ).val( dialogueId );
            $sendDialog.find( "input[name=to_role]" ).val( toRole );
            $sendDialog.find( "input[name=to_uid]" ).val( toUid );
            $sendDialog.find( ".js-receivers" ).html( receivers );
            setTimeout(function(){
                $sendDialog.find( "textarea[name=content]" ).focus();
            }, 1000);
        });
    },
    initDialog: function( dSendDialog ) {
        var _this = this,
            $sendDialog = dSendDialog ? $( dSendDialog ) : $( "#message-send-dialog" );
        $sendDialog.delegate( ".js-send-btn", "click", function() {
            var $btn = $( this ),
                btnText = $btn.html(),
                dialogueId = $sendDialog.find( "input[name=dialogue_id]" ).val();
            $btn.parent().find( "button" ).attr( "disabled", true );
            $btn.html( "发送中..." );
            _this.post( dSendDialog, function( res ) {
                res = $.parseJSON( res );
                if ( res.status ) {
                    $sendDialog.find( "textarea[name=content]" ).val( "" );
                    // 我的私信页
                    if ( $( "#dialogue-" + dialogueId )[0] ) {
                        alertify.success( res.info, 1500 );
                        Message.list.refreshRow( dialogueId );
                        $sendDialog.modal( "hide" );
                    // 私信对话页
                    } else if ( $( "#dialogue-floor-list" )[0] ) {
                        Message.dialogue.pageTitleFlash = false;
                        Message.dialogue.loadingNew();
                    // 其他页面
                    } else {
                        alertify.success( res.info, 1500 );
                        $sendDialog.modal( "hide" );
                    }
                } else {
                    alertify.error( res.info, 2000 );
                }
                $btn.parent().find( "button" ).attr( "disabled", false );
                $btn.html( btnText );
            } );
            return false;
        } );
    },
    post: function( dSendDialog, cb ) {
        var $sendDialog = dSendDialog ? $( dSendDialog ) : $( "#message-send-dialog" ),
            $form = $sendDialog.find( "form" ),
            url = $form.attr( "action" ),
            postData = {
                dialogue_id: $form.find( "input[name=dialogue_id]" ).val() || "",
                to_role: $form.find( "input[name=to_role]" ).val() || "",
                to_uid: $form.find( "input[name=to_uid]" ).val() || "",
                content: $form.find( "textarea[name=content]" ).val() || "",
            };
        $.post( url, postData, cb );
    }
};

$(function(){
    // 只有登录状态下才查询未读私信数
    ROLE && Message.unread.init();
    Message.send.initBtn();
    Message.send.initDialog();
});
