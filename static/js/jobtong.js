$(function() {
    $("#feedback-link").on("click", function() {
        $.magnificPopup.open({
            items: {
                src: $("#feedback-popup"),
                type: 'inline'
            },
            enableEscapeKey: false,
            closeOnBgClick: false
        });
    });

    $("#feedback-popup-submit").on("click", function() {
        var $feedbackPopup       = $("#feedback-popup");
        var $feedbackPopupSubmit = $("#feedback-popup-submit");
        var $feedbackPopupCancel = $("#feedback-popup-cancel");
        var qq      = $feedbackPopup.find("input[name='qq']").val();
        var email   = $feedbackPopup.find("input[name='email']").val();
        var content = $feedbackPopup.find("textarea[name='content']").val();
        $.ajax(U('/Index/feedback'), {
            type: "POST",
            data: {
                ajax:    1,
                qq:      qq,
                email:   email,
                content: content
            },
            dataType: "json",
            beforeSend: function() {
                $feedbackPopupSubmit.attr("disabled", "disabled").html("提交中...");
                $feedbackPopupCancel.attr("disabled", "disabled");
            },
            success: function(json) {
                $feedbackPopupSubmit.removeAttr("disabled").html("提交");
                $feedbackPopupCancel.removeAttr("disabled");

                if (json.status) {
                    alertify.alert("提交成功，感谢您的反馈，产品经理会尽快与您联系", function() {
                        $.magnificPopup.close();
                    });
                }else {
                    alertify.alert(json.info);
                }
            }
        });
    });

    $("#feedback-popup-cancel").on("click", function() {
        $.magnificPopup.close();
    });
});

function U(url, params) {
    var query = [];
    if (OPEN_SITE) {
        query.push('open_site_id=' + OPEN_SITE['id']);
    }
    if (params && ($.isArray(params) || $.isPlainObject(params))) {
        $.each(params, function(i, n){
            query.push(i + '=' + n);
        });
    }
    return query.length <= 0 ? url : url + '?' + query.join('&');
}

J = {};

J.share_job = function(uuid, network, callback) {
    ga('send', 'social', network, 'share', MAIN_HOME_PAGE + U('/job/' + uuid));

    if (network.toLowerCase() == 'weibo' || network.toLowerCase() == 'qq') {
        window.open(MAIN_HOME_PAGE + U('/Job/share', {uuid:uuid, network:network}));
    }

    if (typeof callback === 'function') {
        callback();
    }
}

J.share_wei_user = function(wei_uid, network, callback) {
    ga('send', 'social', network, 'share', MAIN_HOME_PAGE + U('/e/' + wei_uid));

    if (network.toLowerCase() == 'weibo' || network.toLowerCase() == 'qq') {
        window.open(MAIN_HOME_PAGE + U('/WeiUser/share', {id:wei_uid, network:network}));
    }

    if (typeof callback === 'function') {
        callback();
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

Util = {};

Util.get_sex = function(sex_code) {
    return parseInt(sex_code) == 1 ? '男' : '女';
}

Util.get_degree_list = function() {
    return ['专科以下', '专科', '本科', '硕士', '博士'];
}

Util.get_degree = function(index) {
    return Util.get_degree_list()[index];
}

Util.get_work_status_list = function() {
    return ['', '目前在职，考虑换个环境', '目前离职，可以快速到岗', '应届毕业生', '暂时不找工作'];
}

Util.get_work_status = function(index) {
    return Util.get_work_status_list()[index];
}

Util.get_salary_list = function() {
    return ['', '3000以下', '3001-5000', '5001-8000', '8001-15000', '15001-20000', '20001以上'];
}

Util.get_salary = function(index) {
    return Util.get_salary_list()[index];
}

Util.get_company_size_list = function() {
    return ['', '15人以下', '15-50人', '50-150人', '150-500人', '500-2000人', '2000人以上'];
}

Util.get_company_size = function(index) {
    return Util.get_company_size_list()[index];
}

Util.get_company_nature_list = function() {
    return ['', '私企', '外企', '国企'];
}

Util.get_company_nature = function(index) {
    return Util.get_company_nature_list()[index];
}

Util.get_province_list = function() {
    return ['Unknown','北京市','天津市','上海市','重庆市','河北省','山西省','台湾省','辽宁省','吉林省','黑龙江省','江苏省','浙江省','安徽省','福建省','江西省','山东省','河南省','湖北省','湖南省','广东省','甘肃省','四川省','贵州省','海南省','云南省','青海省','陕西省','广西壮族自治区','西藏自治区','宁夏回族自治区','新疆维吾尔自治区','内蒙古自治区','澳门特别行政区','香港特别行政区'];
}

Util.get_province = function(index) {
    return Util.get_province_list()[index];
}

Util.get_city_list = function() {
    var city_list = [];
    city_list[11] = "北京";
    city_list[12] = "上海";
    city_list[13] = "广州";
    city_list[14] = "深圳";
    city_list[15] = "杭州";
    city_list[16] = "苏州";
    city_list[17] = "南京";
    city_list[18] = "大连";
    city_list[19] = "成都";

    city_list[21] = "天津";
    city_list[22] = "沈阳";
    city_list[23] = "长春";
    city_list[24] = "哈尔滨";
    city_list[25] = "石家庄";
    city_list[26] = "秦皇岛";
    city_list[27] = "太原";
    city_list[28] = "呼和浩特";

    city_list[31] = "无锡";
    city_list[32] = "济南";
    city_list[33] = "厦门";
    city_list[34] = "宁波";
    city_list[35] = "福州";
    city_list[36] = "青岛";
    city_list[37] = "合肥";
    city_list[38] = "扬州";

    city_list[41] = "香港";
    city_list[42] = "武汉";
    city_list[43] = "郑州";
    city_list[44] = "长沙";
    city_list[45] = "海南";
    city_list[46] = "佛山";
    city_list[47] = "南昌";
    city_list[48] = "珠海";
    city_list[49] = "东莞";
    city_list[410] = "南宁";

    city_list[51] = "西安";
    city_list[52] = "重庆";
    city_list[53] = "昆明";
    city_list[54] = "乌鲁木齐";
    city_list[55] = "兰州";
    city_list[56] = "贵阳";
    city_list[57] = "西宁";

    return city_list;
}

Util.get_city = function(index) {
    return Util.get_city_list()[index];
}

Util.url_format = function(url) {
    if (url && url.substr(0, 4) != 'http') {
        url = 'http://' + url;
    }

    return url;
}

Util.get_short_string = function(string, length) {
    if (length > 0 && string.length > length) {
        string = string.substr(0, length) + '...';
    }

    return string;
}

function nl2br (str, is_xhtml) {
  var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>';
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}