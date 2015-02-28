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
        .done(function(data) {
            console.log(data);
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

(function($){

$.tpl("district_list",[
    '<label class="radion-inline">',
       '<input class="select_box_button value_change_submit" type="radio" name="district" value="{id:s}"><span>{name:s}</span>',
       '</label>'
]);

var value = $("input[name=city]").val();
console.log(value);
$.ajax({
    url: '/district/' + value,
    dataType: 'json',
})
.done(function(data) {
    $.each(data, function(index, val) {
        $.tpl('district_list', {
            id: val.id,
            name: val.name,
        }).appendTo("#district_filter");
    });
})
.fail(function() {
    console.log("error");
})
.always(function() {
    console.log("complete");
});

$("input[name=city]").change(function() {
    $("#district_filter").text("")
    $("#district_filter").append('<label class="radion-inline"> <input  class="select_box_button value_change_submit" type="radio" checked="checked" name="district" value=""><span>全部</span> </label>')

    $.ajax({
        url: '/district/' + $(this).val(),
        dataType: 'json',
    })
    .done(function(data) {
        $.each(data, function(index, val) {
            $.tpl('district_list', {
                id: val.id,
                name: val.name,
            }).appendTo("#district_filter");
        });
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });

     /* Act on the event */
});
$(".value_change_submit").change(function(){
    $("#filterform").submit();
});
$.tpl("city_choices", [
    '<option value="{id:s}">{name:s}</option>'
]);

$("#province").change(function(){
    // console.log("i am changing");
    $("#city").text("");
    $.ajax({
        url: '/citys/' + $(this).val(),
        dataType: 'json',
    })
    .done(function(data) {
        console.log(data);
        $.each(data, function(index, val) {
            $.tpl("city_choices", {
                id: val.id,
                name: val.value,
            }).appendTo("#city");
        });
        // console.log("success");
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });

    $(this).val()
})
})(jQuery);


