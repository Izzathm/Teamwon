$( document ).ready(function() {
    $(".btn ").prop('disabled',true)
});
var app;
require([
    "esri/Map",
    "esri/layers/GraphicsLayer",
    "esri/Graphic",
    "esri/geometry/Point",
    "esri/tasks/Geoprocessor",
    "esri/tasks/support/LinearUnit",
    "esri/tasks/support/FeatureSet",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/symbols/SimpleLineSymbol",
  "dojo/ready",
  "esri/views/2d/draw/Draw",
  "dojo/on",
  "dojo/domReady!"
], function(Map, GraphicsLayer, Graphic, Point, Geoprocessor, LinearUnit, FeatureSet, MapView, FeatureLayer,SimpleLineSymbol,ready,Draw,on ){
    //a map with basemap
    function init(){
        var map = new Map({
    basemap: "streets"
	});

     var symbolLine = {
      type: "simple-line",  // autocasts as new SimpleLineSymbol()
      color: [149, 194, 115],
      width: "2px",
      style: "style_solid"
	};
    // featureLayer = new FeatureLayer({
    //         url: "http://geoserver2.byu.edu/arcgis/rest/services/TeamWon/Utah_bus_stops/FeatureServer/",
    //     });
    // featureLayer.symbol = symbolLine
    // map.layers.add(featureLayer);

    // leg_dem = document.getElementById("legend_dem")
		// 	leg_rest = document.getElementById("legend_rest")
    //
    //         leg_dem.onchange =function(){
		// 		layer1.visible = leg_dem.checked
		// 	}
    //         leg_rest.onchange =function(){
		// 		featureLayer.visible = leg_rest.checked
		// 	}
    //a graphics layer to show input point and output polygon
    var graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-111.67266235351346, 40.24052798830994],
        zoom: 10
    });
    $("#viewDiv").show()
    $(".btn ").prop('disabled',false)
    $("#loader_map").hide()

    // view.whenLayerView(featureLayer).then(function(lyrView){
    //   lyrView.watch("updating", function(val){
    //     if(!val){  // wait for the layer view to finish updating
    //       lyrView.queryFeatures().then(function(results){
    //         setTimeout(function(){
    //                 console.log("done loading");
    //                 $("#viewDiv").show()
    //                 $(".btn ").prop('disabled',false)
    //                 $("#loader_map").hide()
    //             }, 3000);
    //           // prints all the client-side graphics to the console
    //       });
    //     }
    //   });
    // });

	// symbol for input point
	var markerSymbol = {
          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          color: [255, 0, 0],
          outline: { // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: 2
          }
        };
    var markerSymbol2 = {
          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          color: [30, 143, 12],
          outline: { // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: 2
          }
        };
    //
	// // symbol for buffered polygon
    var fillSymbol = {
          type: "simple-fill", // autocasts as new SimpleFillSymbol()
          color: [226, 119, 40, 0.75],
          outline: { // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: 1
          }
        };


     var bus_routes_color = {
      type: "simple-line",  // autocasts as new SimpleLineSymbol()
      color: [75, 251, 52],
      width: "2px",
      style: "style_solid"
	};
      var sponsored_color = {
      type: "simple-line",  // autocasts as new SimpleLineSymbol()
      color: [127,74, 190],
      width: "2px",
      style: "style_solid"
	};
       var uber_color = {
      type: "simple-line",  // autocasts as new SimpleLineSymbol()
      color: [240, 42, 22],
      width: "2px",
      style: "style_solid"
	};
    // Geoprocessing service url
	// var gpUrl = "http://geoserver2.byu.edu/arcgis/rest/services/sherry/BufferPoints/GPServer/Buffer%20Points";
	// var gpUrl = "http://geoserver2.byu.edu/arcgis/rest/services/TeamWon/BufferPoints/GPServer/Buffer%20Points";
	var gpUrl = "http://geoserver2.byu.edu/arcgis/rest/services/TeamWon/CreateWatershedPolygon/GPServer/Create%20Watershed%20Polygon";
	var gpUrl_clip = "http://geoserver2.byu.edu/arcgis/rest/services/TeamWon/Provo_Repro/GPServer/Provo_clip";
    var gpSponsored = "http://geoserver2.byu.edu/arcgis/rest/services/TeamWon/Sponsored/GPServer/Sponsored";
    var gpUber = "http://geoserver2.byu.edu/arcgis/rest/services/TeamWon/Uber_Route/GPServer/Uber_Route";
    var gpBus = "http://geoserver2.byu.edu/arcgis/rest/services/TeamWon/Bus_Route/GPServer/Bus_Route";
    // create a new Geoprocessor

    var gp = new Geoprocessor(gpUrl);
	var gp_clip = new Geoprocessor(gpUrl_clip);
    var gp_spon = new Geoprocessor(gpSponsored)
    var gp_uber = new Geoprocessor(gpUber)
    var gp_bus = new Geoprocessor(gpBus)

	// define output spatial reference
    gp.outSpatialReference = { // autocasts as new SpatialReference()
          wkid: 102100 //EPSG3857
          // wkid: 4326 //EPSG3857
        };
    gp_uber.outSpatialReference = { // autocasts as new SpatialReference()
          wkid: 3857 //EPSG3857
          // wkid: 4326 //EPSG3857
        };

    function createPoint(location) {
        // view.graphics.removeAll();
        // graphicsLayer.removeAll();
        var graphic_re
        console.log(location)
        for (graphic in graphicsLayer.graphics.items) {
            console.log(graphicsLayer.graphics.items[graphic].attributes.id)
            if (graphicsLayer.graphics.items[graphic].attributes.id == location) {
                graphic_re = graphicsLayer.graphics.items[graphic];
            }
        }
        console.log(graphic_re)
        graphicsLayer.remove(graphic_re);

        var draw = new Draw({
            view: view
        });
         // tb = new Draw(map);
         var action = draw.create("point");
        action.on("draw-complete", function (evt) {
            console.log(view.spatialReference)
            // console.log(evt.mapPoint.longitude)
            var point = new Point({
                x: evt.coordinates[0],
                y: evt.coordinates[1],
                spatialReference: view.spatialReference
            });
            if(location == 'origin'){
                symbol_marker = markerSymbol2
            }
            else{
                symbol_marker = markerSymbol
            }
            var inputGraphic = new Graphic({
                geometry: point,
                symbol: symbol_marker,
                attributes:{'id':location}
            });
            console.log(view)
            graphicsLayer.add(inputGraphic);
             // view.graphics.add(inputGraphic);
        })


    }
    function getRoutes(){
        console.log("getting route information")
        var uber_chk = $("#uberChk").is(':checked')
        var spon_chk = $("#redFareChk").is(':checked')
        var bus_chk = $("#busesChk").is(':checked')
        var walk_chk = $("#walkingChk").is(':checked')

        var uber_cost = $("#uberCost").val();
        var avg_speed = $("#averSpeed").val();
        var rest_sel = $("#sel1").val();
        var featureSet_origin = new FeatureSet();
        var featureSet_destination = new FeatureSet();

        for (graphic in graphicsLayer.graphics.items){
            console.log(graphicsLayer.graphics.items[graphic].attributes.id)
            if (graphicsLayer.graphics.items[graphic].attributes.id == 'origin'){
                featureSet_origin.features = [graphicsLayer.graphics.items[graphic]];
                console.log(graphicsLayer.graphics.items[graphic])
            }
            if (graphicsLayer.graphics.items[graphic].attributes.id == 'destination'){
                featureSet_destination.features = [graphicsLayer.graphics.items[graphic]];
            }
        }

        console.log(uber_chk);
        console.log(spon_chk);
        console.log(bus_chk);
        console.log(walk_chk);
        console.log(uber_cost);
        console.log(avg_speed);
        console.log(rest_sel);
        fastName = 'McDonalds'

        var params_spon = {
            "Expression": "Field1 = '" + fastName + "'",
            "Start": featureSet_origin,
            "End": featureSet_destination,
        };
        var params = {
            "Start": featureSet_origin,
            "End": featureSet_destination,
        };

        var params_bus = {
            "Start": featureSet_origin,
            "End": featureSet_destination,
        };

        gp_uber.submitJob(params).then(completeCallback, errBack, statusCallback);
        //gp_bus.submitJob(params_bus).then(completeCallback_bus, errBack, statusCallback);
        //gp_spon.submitJob(params_spon).then(completeCallback_spon, errBack, statusCallback);
    }


	function completeCallback(result){

        gp_uber.getResultData(result.jobId, "Reprojected_Route").then(drawResult, drawResultErrBack);

	}
	function completeCallback_bus(result){

        gp_bus.getResultData(result.jobId, "start_stop").then(drawResult_bus, drawResultErrBack);
        gp_bus.getResultData(result.jobId, "stop_stop ").then(drawResult_bus, drawResultErrBack);
        gp_bus.getResultData(result.jobId, "stop_end").then(drawResult_bus, drawResultErrBack);

	}

	function completeCallback_spon(result){

        gp_spon.getResultData(result.jobId, "start_to_food").then(drawResult_spon, drawResultErrBack);
        gp_spon.getResultData(result.jobId, "food_to_end ").then(drawResult_spon, drawResultErrBack);

	}

	function completeCallback_clip(result){
        gp_clip.getResultData(result.jobId, "Clip_bus_Project").then(drawResult_clip, drawResultErrBack);
	}

    //	var time_uber;
    //	var time_spon;
    //	var time_bus;

	function drawResult(data){
        var polygon_feature3 = data.value.features;
        //var uber_length = 0;

        for (fea in polygon_feature3){
            polygon_feature3[fea].symbol = uber_color;
            graphicsLayer.add( polygon_feature3[fea]);

            //read the Shape_Length attribute from each feature
//            console("ssssssssssssssssssssssssss");
//            console(fea.Shape_Length)
            //fea_length = fea.Shape_Length
            //uber_length = uber_length + fea_length;
        }

        //time_uber = time_calc(uber_length);

        $(".btn ").prop('disabled',false)
        $("#loader_map").hide()
        $(".btn ").prop('disabled',false)
        $("#loader_map").hide()
	}
    function drawResult_spon(data){
        var polygon_feature3 = data.value.features;
        for (fea in polygon_feature3){
            polygon_feature3[fea].symbol = sponsored_color;
            graphicsLayer.add( polygon_feature3[fea]);
        }
        $(".btn ").prop('disabled',false);
        $("#loader_map").hide();
        $(".btn ").prop('disabled',false);
        $("#loader_map").hide();
	}

	function drawResult_bus(data){
        console.log(data)
        console.log('CCCCCCCCCCCCCCCCCCCClip')
        var polygon_feature3 = data.value.features;
        for (fea in polygon_feature3){
            polygon_feature3[fea].symbol = bus_routes_color;
            graphicsLayer.add( polygon_feature3[fea]);
        }
        $(".btn ").prop('disabled',false);
        $("#loader_map").hide();
        $(".btn ").prop('disabled',false);
        $("#loader_map").hide()
	};

	function drawResult_clip(data){
        var polygon_feature3 = data.value.features;
        for (fea in polygon_feature3){
            polygon_feature3[fea].symbol = bus_routes_color;
            graphicsLayer.add( polygon_feature3[fea]);
        }
        $(".btn ").prop('disabled',false);
        $("#loader_map").hide();
	}

	function drawResultErrBack(err) {
        console.log("draw result error: ", err);
        alert("The process failed")
         $(".btn ").prop('disabled',false)
        $("#loader_map").hide()
    }

	function statusCallback(data) {
        console.log(data.jobStatus);
    }

    function errBack(err) {
        console.log("gp error: ", err);
        alert("The process failed")
         $(".btn ").prop('disabled',false)
        $("#loader_map").hide()
    }
    function showLoading(){
        console.log("show loading")
    }
    app = {
            // bufferPoint:bufferPoint,
        createPoint:createPoint,
        getRoutes:getRoutes
    };
}

ready(init)
});

function openCity(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

function time_calc(length) {

var speedLimit = 25.00;

var time = length/speedLimit

}
