//获取省
/*var getArea = function(i,pre){//i:1省，2：市，3：区，用于前端改变 对应的内容
	$.ajax({
	  type: 'POST',
	  url: getAreaUrl,
	  data: {"pre":pre},
	 // dataType:'json',
	  success: function(data, textStatus){
			changArea(i,data);		
			},
			complete: function(XMLHttpRequest, textStatus){
				//HideLoading();
			},
			error: function(){
				//请求出错处理
			}
	});
}
getArea(1,"省");

//动态改变省市区的下拉
var changArea = function(type,data){//type:1省，2：市，3：区，用于前端改变 对应的内容
	if(type==1){//省
	$("#seltS").empty();//清空
		$.each(data.list, function(i, item) {
			$("#seltS").append("<option>"+item.province+"</option>");
    });
	getArea($("#seltS").attr("t"),$("#seltS option:first").text());//取市
	}

	if(type==2){//市
	$("#seltC").empty();//清空
		$.each(data.list, function(i, item) {
			$("#seltC").append("<option>"+item.city+"</option>");
    });
	getArea($("#seltC").attr("t"),$("#seltC option:first").text());//取区
	}

	if(type==3){//区
	$("#seltA").empty();//清空
		$.each(data.list, function(i, item) {
			$("#seltA").append("<option>"+item.area+"</option>");
    });
	}	
}

//选中改变下一级
$(".Ac").change(function(){
//	getArea(2,$("#seltS option:selected").text());//获取下拉值,等值下面的
	getArea($(this).attr("t"),$(this).children('option:selected').text());
});
*/



	var getArea = function(i,pre){//i:1省，2：市，3：区，用于前端改变 对应的内容
	$.ajax({
	  type: 'POST',
	  url: getAreaUrl,
	  data: {"pre":pre},
	 // dataType:'json',
	  success: function(data, textStatus){
			changArea(i,data);		
			},
			complete: function(XMLHttpRequest, textStatus){
				//HideLoading();
			},
			error: function(){
				//请求出错处理
			}
	});
}

/*getArea(22,sheng);//获取全部的城市
getArea(33,shi);//获取全部的地区
getArea(1,"省");//获取开发的城市
*/
var historyC="";//城市的历史模板值
var historyA="";//地区的历史模板值
//动态改变省市区的下拉
var changArea = function(type,data){//type:1省，2：市，3：区，用于前端改变 对应的内容
	if(type==1){//省
	$("#seltS").empty();//清空
	$("#seltS").append("<option>--省份--</option>");
		$.each(data.list, function(i, item) {
			$("#seltS").append("<option>"+item.province+"</option>");
    });
	//getArea($("#seltS").attr("t"),$("#seltS option:first").text());//取市
	}

	if(type==2){//市
	$("#seltC").empty();//清空
	$("#seltC").append("<option>--城市--</option>");
		$.each(data.list, function(i, item) {
			if(historyC==item.city){
			$("#seltC").append("<option selected='selected'>"+item.city+"</option>");
			}else{				
			$("#seltC").append("<option>"+item.city+"</option>");
			}
    });
//	getArea($("#seltC").attr("t"),$("#seltC option:first").text());//取区
getArea($("#seltC").attr("t"),$("#seltC option:selected").text());//取区
	}

	if(type==22){//市---不取地区
	$("#seltC").empty();//清空
		$.each(data.list, function(i, item) {
			$("#seltC").append("<option>"+item.city+"</option>");
    });
		defaultArea();
	//getArea($("#seltC").attr("t"),$("#seltC option:first").text());//取区
	}

	if(type==3){//区
	$("#seltA").empty();//清空
	$("#seltA").append("<option>--地区--</option>");
		$.each(data.list, function(i, item) {
			if(historyA==item.area){				
			$("#seltA").append("<option selected='selected'>"+item.area+"</option>");	
			}else{
			$("#seltA").append("<option>"+item.area+"</option>");
			}
    });
	}
	if(type==33){//区--设置默认值的
	$("#seltA").empty();//清空
//	$("#seltA option[index>'0']").remove();
		$.each(data.list, function(i, item) {
			$("#seltA").append("<option>"+item.area+"</option>");
    });
		//alert(1);
		defaultArea();
	}


	if(type==4){//省
	$("#seltS").empty();//清空
//	$("#seltS").append("<option>--省份--</option>");
		$.each(data.list, function(i, item) {
			$("#seltS").append("<option>"+item.province+"</option>");
    });
	getArea($("#seltS").attr("t"),$("#seltS option:first").text());//取市
	}

	if(type==5){//市
	$("#seltC").empty();//清空
//	$("#seltC").append("<option>--城市--</option>");
		$.each(data.list, function(i, item) {
			$("#seltC").append("<option>"+item.city+"</option>");
    });
	getArea($("#seltC").attr("t"),$("#seltC option:first").text());//取区
	}

	

	if(type==6){//区
	$("#seltA").empty();//清空
//	$("#seltA").append("<option>--地区--</option>");
		$.each(data.list, function(i, item) {
			$("#seltA").append("<option>"+item.area+"</option>");
    });
	}	
}

//选中改变下一级
$(".Ac").change(function(){
//	getArea(2,$("#seltS option:selected").text());//获取下拉值,等值下面的
	getArea($(this).attr("t"),$(this).children('option:selected').text());
});

	var defaultArea = function(){
	$("#seltS").val(sheng);//值
	$("#seltC").val(shi);//值
	$("#seltA").val(qu);//值
};

