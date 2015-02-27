// JavaScript Document
// 百度地图API功能
var lng = "";
var lat = "";
function G(id) {
    return document.getElementById(id);
}

var map = new BMap.Map("l-map");

//根据定位当前位置
function myFun(result){
    var cityName = result.name;
   map.centerAndZoom(cityName, 15);                 // 初始化地图，设置中心点坐标和地图级别  
}
var myCity = new BMap.LocalCity();
myCity.get(myFun);

var oIpt=document.getElementById("suggestId");
var myGeo = new BMap.Geocoder();		// 创建地址解析器实例
$("#suggestId").keyup(function(e){
	e = e || window.event;
	if(e.keyCode==13){
		locHere();
	}
});

/*$("#suggestId").blur(function(){
	locHere();
});*/

$("#seltS,#seltC,#seltA").blur(function(){
	locHere();
});

function locHere(){
	map.clearOverlays();		//移除所有覆盖物\标注
	myGeo.getPoint(oIpt.value, function(point){		// 将地址解析结果显示在地图上,并调整地图视野
		if (point) {
			var mkr =new BMap.Marker(point, {enableDragging: true, raiseOnDrag: true})		//实例化标注，添加拖拽属性和动画效果
			map.centerAndZoom(point, 15);
			map.addOverlay(mkr);
			lng=point.lng;
			lat=point.lat;
				
			//拖拽监听
			mkr.addEventListener('dragend', function(e){
				//alert(e.point.lng +', '+e.point.lat); 
				lng=e.point.lng;
				lat=e.point.lat;
			});
		}
	});
}

$("#seltS").on("change",function(){
	//map.centerAndZoom(this.value,15);
	$("#suggestId").val($("#seltS").val());
});

$("#seltC").on("change",function(){
	//map.centerAndZoom($("#seltS").val()+this.value,15); 
	$("#suggestId").val($("#seltS").val()+$("#seltC").val());
});

$("#seltA").on("change",function(){
	//map.centerAndZoom($("#seltS").val()+$("#seltC").val()+this.value,15); 
	$("#suggestId").val($("#seltS").val()+$("#seltC").val()+$("#seltA").val());
});

map.enableScrollWheelZoom();    //启用滚轮放大缩小，默认禁用
