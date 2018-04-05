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

    featureLayer = new FeatureLayer({
            url: "http://geoserver2.byu.edu/arcgis/rest/services/TeamWon/Utah_bus_stops/FeatureServer/",
        });
    map.layers.add(featureLayer);

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

    view.whenLayerView(featureLayer).then(function(lyrView){
      lyrView.watch("updating", function(val){
        if(!val){  // wait for the layer view to finish updating
          lyrView.queryFeatures().then(function(results){
            setTimeout(function(){
                    console.log("done loading");
                    $("#viewDiv").show()
                    $(".btn ").prop('disabled',false)
                    $("#loader_map").hide()
                }, 3000);
              // prints all the client-side graphics to the console
          });
        }
      });
    });

	// symbol for input point
	var markerSymbol = {
          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          color: [255, 0, 0],
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

    var symbolLine = {
      type: "simple-line",  // autocasts as new SimpleLineSymbol()
      color: [75, 251, 52],
      width: "2px",
      // style: "short-dot"
	};
     var bus_routes_color = {
      type: "simple-line",  // autocasts as new SimpleLineSymbol()
      color: [75, 251, 52],
      width: "2px",
      style: "short-dot"
	};
      var sponsored_color = {
      type: "simple-line",  // autocasts as new SimpleLineSymbol()
      color: [75, 251, 52],
      width: "2px",
      style: "short-dot"
	};
       var uber_color = {
      type: "simple-line",  // autocasts as new SimpleLineSymbol()
      color: [75, 251, 52],
      width: "2px",
      style: "short-dot"
	};
    // Geoprocessing service url
	// var gpUrl = "http://geoserver2.byu.edu/arcgis/rest/services/sherry/BufferPoints/GPServer/Buffer%20Points";
	// var gpUrl = "http://geoserver2.byu.edu/arcgis/rest/services/TeamWon/BufferPoints/GPServer/Buffer%20Points";
	var gpUrl = "http://geoserver2.byu.edu/arcgis/rest/services/TeamWon/CreateWatershedPolygon/GPServer/Create%20Watershed%20Polygon";
	var gpUrl_clip = "http://geoserver2.byu.edu/arcgis/rest/services/TeamWon/Provo_Repro/GPServer/Provo_clip";

    // create a new Geoprocessor

    var gp = new Geoprocessor(gpUrl);
	var gp_clip = new Geoprocessor(gpUrl_clip);


	// define output spatial reference
    gp.outSpatialReference = { // autocasts as new SpatialReference()
          wkid: 102100 //EPSG3857
          // wkid: 4326 //EPSG3857
        };

	//add map click function
    // view.on("click", createPoint);
    // view.on("click", clip_bus);
    // function initToolbar() {
    //   tb = new Draw(map);
    //   tb.on("draw-end", addGraphic);
    //
    //   // event delegation so a click handler is not
    //   // needed for each individual button
    //   on(dom.byId("info"), "click", function(evt) {
    //     if ( evt.target.id === "info" ) {
    //       return;
    //     }
    //     var tool = evt.target.id.toLowerCase();
    //     map.disableMapNavigation();
    //     tb.activate(tool);
    //   });
    // }

	//main function
    // function createPoint(event) {
    function createPoint() {
        view.graphics.removeAll();
         graphicsLayer.removeAll();
        var draw = new Draw({
            view: view
        });
         // tb = new Draw(map);
         var action = draw.create("point");
            console.log(action)
          // action.on("cursor-update", function (evt) {
          //   console.log(evt.coordinates)
          // });
        // fires when a vertex is added
        action.on("draw-complete", function (evt) {
            console.log(evt)
            // console.log(evt.mapPoint.longitude)
            var point = new Point({
                x: evt.coordinates[0],
                y: evt.coordinates[1],
                spatialReference: view.spatialReference
            });
            var inputGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol,
                attributes:{'id':'input_point'}
            });
            console.log(view)
             graphicsLayer.add(inputGraphic);
             // view.graphics.add(inputGraphic);
        })

        // console.log(event.mapPoint.longitude)
        // console.log(event.mapPoint.latitude)
        //   graphicsLayer.removeAll();
        //   var point = new Point({
        //     longitude: event.mapPoint.longitude,
        //     latitude: event.mapPoint.latitude
        //   });
        //
        //   var inputGraphic = new Graphic({
        //     geometry: point,
        //     symbol: markerSymbol,
        //       attributes:{'id':'input_point'}
        //   });
        //
        //   graphicsLayer.add(inputGraphic);
        //     console.log(graphicsLayer)
        //   var inputGraphicContainer = [];
        //   inputGraphicContainer.push(inputGraphic);
        //
        //   console.log(inputGraphicContainer)
        //   var featureSet = new FeatureSet();
        //   featureSet.features = inputGraphicContainer;
        //
        //   var bfDistance = new LinearUnit();
        //   bfDistance.distance = 100;
        //   bfDistance.units = "miles";
        //
		 //  // input parameters
        //   // var params = {
        //    //  "Point": featureSet,
        //    //  "Distance": bfDistance
        //   // };
        //
        //   // var params = {
        //   //   "Input_Features": featureSet,
        //   //   "Distance": bfDistance
        //   // };
        //    var params = {
        //     "Pour_Point": featureSet,
        //   };

          // gp.submitJob(params).then(completeCallback, errBack, statusCallback);
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
        var featureSet = new FeatureSet();

        for (graphic in graphicsLayer.graphics.items){
            console.log()
            if (graphicsLayer.graphics.items[graphic].attributes.id == 'input_point'){
                featureSet.features = [graphicsLayer.graphics.items[graphic]];
            }
        }

        console.log(uber_chk);
        console.log(spon_chk);
        console.log(bus_chk);
        console.log(walk_chk);
        console.log(uber_cost);
        console.log(avg_speed);
        console.log(rest_sel);
        console.log(featureSet);

        var params = {
            "placeholder": uber_chk,
            "placeholder": spon_chk,
            "placeholder": bus_chk,
            "placeholder": walk_chk,
            "placeholder": uber_cost,
            "placeholder": avg_speed,
            "placeholder": rest_sel,
            "placeholder": featureSet,
        };
        // gp.submitJob(params).then(completeCallback, errBack, statusCallback);
    }
    function bufferPoint(){
        $(".btn ").prop('disabled',true)
        $("#loader_map").show()
        var featureSet = new FeatureSet();
        // featureSet.features = inputGraphicContainer;
        for (graphic in graphicsLayer.graphics.items){
            console.log()
            if (graphicsLayer.graphics.items[graphic].attributes.id == 'input_point'){
                featureSet.features = [graphicsLayer.graphics.items[graphic]];
            }
        }
        // featureSet.features = [graphicsLayer.graphics.items[0]];
        var params = {
            "Pour_Point": featureSet,
          };

          gp.submitJob(params).then(completeCallback, errBack, statusCallback);
    }


    function clip_bus(event) {

        graphicsLayer.removeAll();

        $(".btn ").prop('disabled',true)
        $("#loader_map").show()

        sql_expression = "\"Name\":'Provo'"
        var params = {
        "BusRoutes_UTA ": "BusRoutes_UTA",
           // "Expression":sql_expression

        };
        gp_clip.submitJob(params).then(completeCallback_clip, errBack, statusCallback);
    }

	function completeCallback(result){

        gp.getResultData(result.jobId, "Output_Watershed ").then(drawResult, drawResultErrBack);

	}

	function completeCallback_clip(result){
        gp_clip.getResultData(result.jobId, "Clip_bus_Project").then(drawResult_clip, drawResultErrBack);
	}

	function drawResult(data){
        console.log(data)
	    var polygon_feature = data.value.features[0];
		polygon_feature.symbol = fillSymbol;
		graphicsLayer.add(polygon_feature);
        $(".btn ").prop('disabled',false)
        $("#loader_map").hide()
	}
	function drawResult_clip(data){
        console.log(data)
        console.log('CCCCCCCCCCCCCCCCCCCClip')
        var polygon_feature3 = data.value.features;
        for (fea in polygon_feature3){
            polygon_feature3[fea].symbol = bus_routes_color;


            // var polygon_feature1 = data.value.features[1];
            // graphicsLayer.add(polygon_feature);
            graphicsLayer.add( polygon_feature3[fea]);
            // graphicsLayer.add(polygon_feature1);
        }
        $(".btn ").prop('disabled',false)
        $("#loader_map").hide()
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
    app = {clip_bus: clip_bus,
            bufferPoint:bufferPoint,
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
