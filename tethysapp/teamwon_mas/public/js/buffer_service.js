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
  "esri/geometry/geometryEngine",
  "dojo/domReady!"
], function(Map, GraphicsLayer, Graphic, Point, Geoprocessor, LinearUnit, FeatureSet, MapView, FeatureLayer,SimpleLineSymbol,ready,Draw,on,geometryEngine ){
    //a map with basemap
    function init(){
        var map = new Map({
    basemap: "streets"
	});

    var outside = 10
     var symbolLine = {
      type: "simple-line",  // autocasts as new SimpleLineSymbol()
      color: [149, 194, 115],
      width: "2px",
      style: "style_solid"
	};
    var uber_len = [];
    var spon_len = [];
    var bus_len = [];
    var last_fun = 'uber'
    var provoCity = new FeatureLayer({
            url: "http://geoserver2.byu.edu/arcgis/rest/services/TeamWon/ProvoCity/FeatureServer/",
        });
    map.layers.add(provoCity);

    var graphicsOrigin = new GraphicsLayer();
    var graphicsDestination = new GraphicsLayer();
    var uberGraphicLayer = new GraphicsLayer();
    var sponGraphicLayer = new GraphicsLayer();
    var busGraphicLayer = new GraphicsLayer();
    var busStopGraphicLayer = new GraphicsLayer();
    var restStopGraphicLayer = new GraphicsLayer();
    map.add(graphicsOrigin);
    map.add(graphicsDestination);
    map.add(uberGraphicLayer);
    map.add(sponGraphicLayer);
    map.add(busGraphicLayer);
    map.add(busStopGraphicLayer);
    map.add(restStopGraphicLayer);

    leg_bus = document.getElementById("chkBus")

    leg_spon = document.getElementById("chkSpon")

    leg_uber = document.getElementById("chkUber")
    // leg_uber_extents = document.getElementById("uber_extents")

    leg_bus_stops = document.getElementById("chkBusStops")

    leg_spon_stops = document.getElementById("chkSponStops")

    leg_origin = document.getElementById("chkOrigin")
    // leg_origin_extents = document.getElementById("origin_extents")

    leg_destination = document.getElementById("chkDestination")

    leg_bus.onchange =function(){
        busGraphicLayer.visible = leg_bus.checked
        busStopGraphicLayer.visible = leg_bus.checked
    }
    leg_spon.onchange =function(){
        sponGraphicLayer.visible = leg_spon.checked
        restStopGraphicLayer.visible = leg_spon.checked
    }
    leg_uber.onchange =function(){
        uberGraphicLayer.visible = leg_uber.checked
    }
    // leg_uber_extents.onclick =function(){
    //     view.goTo(uberGraphicLayer.graphics.items[1].geometry)
    // }
    leg_bus_stops.onchange =function(){
        busStopGraphicLayer.visible = leg_bus_stops.checked
    }
    leg_spon_stops.onchange =function(){
        restStopGraphicLayer.visible = leg_spon_stops.checked
    }
    leg_origin.onchange =function(){
        graphicsOrigin.visible = leg_origin.checked
    }

    // leg_origin_extents.onclick =function(){
    //     view.goTo({target:graphicsOrigin.graphics.items[0].geometry,zoom:16});
    // }
    leg_destination.onchange =function(){
        graphicsDestination.visible = leg_destination.checked
    }
    //a graphics layer to show input point and output polygon


    var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-111.67266235351346, 40.24052798830994],
        zoom: 13
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
    var markerStops = {
          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          color: [255, 102, 0],
          outline: { // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: 3
          }
        };
    var markerStops_spon = {
          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          color: [0, 102, 153],
          outline: { // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: 3
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
      color: [51, 204, 204],
      width: "2px",
      style: "style_solid"
	};
    // Geoprocessing service url
	// var gpUrl = "http://geoserver2.byu.edu/arcgis/rest/services/sherry/BufferPoints/GPServer/Buffer%20Points";
	// var gpUrl = "http://geoserver2.byu.edu/arcgis/rest/services/TeamWon/BufferPoints/GPServer/Buffer%20Points";
	var gpUrl = "http://geoserver2.byu.edu/arcgis/rest/services/TeamWon/CreateWatershedPolygon/GPServer/Create%20Watershed%20Polygon";
	var gpUrl_clip = "http://geoserver2.byu.edu/arcgis/rest/services/TeamWon/Provo_Repro/GPServer/Provo_clip";
    var gpSponsored = "http://geoserver2.byu.edu/arcgis/rest/services/TeamWon/Sponsored_wstop/GPServer/Sponsored_wstop";
    var gpUber = "http://geoserver2.byu.edu/arcgis/rest/services/TeamWon/Uber_Route/GPServer/Uber_Route";
    var gpBus = "http://geoserver2.byu.edu/arcgis/rest/services/TeamWon/Bus_Route_wstops/GPServer/Bus_Route_wstops";
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
        var graphic_re
        if (location == 'origin'){
            graphicsOrigin.remove(graphicsOrigin.graphics.items[0]);
        }
        else{
            graphicsDestination.remove(graphicsDestination.graphics.items[0]);
        }


        //
        // for (graphic in graphicsLayer.graphics.items) {
        //     console.log(graphicsLayer.graphics.items[graphic].attributes.id)
        //     if (graphicsLayer.graphics.items[graphic].attributes.id == location) {
        //         graphic_re = graphicsLayer.graphics.items[graphic];
        //     }
        // }
        // console.log(graphic_re)
        // graphicsLayer.remove(graphic_re);

        var draw = new Draw({
            view: view
        });
        var action = draw.create("point");
        action.on("draw-complete", function (evt) {

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

            provoCity.queryFeatures().then(function(results){
                if (geometryEngine.contains(results.features[0].geometry, inputGraphic.geometry)) {

                    // graphicsLayer.add(inputGraphic);
                     if (location == 'origin'){
                        graphicsOrigin.add(inputGraphic);
                    }
                    else{
                        graphicsDestination.add(inputGraphic);
                    }
                    console.log(graphicsOrigin)
                    // var options = {
                    //   zoom: 5
                    //
                    // };
                    // view.goTo({target:inputGraphic,zoom:16});
                    // view.goTo({target:results.features[0].geometry,zoom:1});
                }
                else{
                    alert("Please select a point in Provo")
                }
                console.log(connected)

            });
        })
    }

    function getRoutes(){
        // for (graphic in graphicsLayer.graphics.items) {
        //     console.log(graphicsLayer.graphics.items[graphic].attributes.id)
        //     if (graphicsLayer.graphics.items[graphic].attributes.id != 'origin'&& graphicsLayer.graphics.items[graphic].attributes.id != 'destination') {
        //         graphic_re = graphicsLayer.graphics.items[graphic];
        //         graphicsLayer.remove(graphic_re);
        //     }
        // }
        startLoading()
        console.log("getting route information")
        var uber_chk = $("#uberChk").is(':checked')
        var spon_chk = $("#redFareChk").is(':checked')
        var bus_chk = $("#busesChk").is(':checked')

        var uber_cost = $("#uberCost").val();
        var avg_speed = $("#averSpeed").val();
        var bus_cost = $("#busCost").val();

        var rest_sel = $("#sel1").val();
        var featureSet_origin = new FeatureSet();
        var featureSet_destination = new FeatureSet();

        // for (graphic in graphicsLayer.graphics.items){
        //     console.log(graphicsLayer.graphics.items[graphic].attributes.id)
        //     if (graphicsLayer.graphics.items[graphic].attributes.id == 'origin'){
        //         featureSet_origin.features = [graphicsLayer.graphics.items[graphic]];
        //         console.log(graphicsLayer.graphics.items[graphic])
        //     }
        //     if (graphicsLayer.graphics.items[graphic].attributes.id == 'destination'){
        //         featureSet_destination.features = [graphicsLayer.graphics.items[graphic]];
        //     }
        // }

        featureSet_origin.features = [graphicsOrigin.graphics.items[0]];


        featureSet_destination.features = [graphicsDestination.graphics.items[0]];


        console.log(uber_chk);
        console.log(spon_chk);
        console.log(bus_chk);
        console.log(uber_cost);
        console.log(avg_speed);
        console.log(rest_sel);
        if (rest_sel == "McDonald's"){fastName="McDonalds"}
        else if(rest_sel == "Wendy's"){fastName="Wendys"}
        else if(rest_sel == "Carl's Jr"){fastName="CARLS JR"}
        else if(rest_sel == "Taco Bell"){fastName="Taco Bell"}

        var params_spon = {
            "Expression": "Field1 = '" + fastName + "'",
            "Start": featureSet_origin,
            "End": featureSet_destination,
        };
        var params = {
            "Start": featureSet_origin,
            "End": featureSet_destination
        };

        var params_bus = {
            "Start": featureSet_origin,
            "End": featureSet_destination
        };

        uberGraphicLayer.removeAll();
        sponGraphicLayer.removeAll();
        busGraphicLayer.removeAll();
        busStopGraphicLayer.removeAll();
        restStopGraphicLayer.removeAll();
        $('tr').hide();
        $('#origin').show()
        $('#destination').show()


        if(uber_chk){
            console.log('submit uber')

            gp_uber.submitJob(params).then(completeCallback, errBack, statusCallback);
        }
        if(spon_chk){
            last_fun = 'spon';
            gp_spon.submitJob(params_spon).then(completeCallback_spon, errBack, statusCallback);
        }
        if(bus_chk){
            last_fun = 'bus';
            gp_bus.submitJob(params_bus).then(completeCallback_bus, errBack, statusCallback);
        }
    }


	function completeCallback(result){

        gp_uber.getResultData(result.jobId, "Reprojected_Route").then(drawResult, drawResultErrBack);

	}
	function completeCallback_bus(result){

        gp_bus.getResultData(result.jobId, "start_stop").then(drawResult_bus, drawResultErrBack);
        gp_bus.getResultData(result.jobId, "stop_stop ").then(drawResult_bus, drawResultErrBack);
        gp_bus.getResultData(result.jobId, "stop_end").then(drawResult_bus, drawResultErrBack);
        gp_bus.getResultData(result.jobId, "end_bus_stop").then(drawResult_point_bus, drawResultErrBack);
        gp_bus.getResultData(result.jobId, "start_bus_stop ").then(drawResult_point_bus, drawResultErrBack);

	}

	function completeCallback_spon(result){
        gp_spon.getResultData(result.jobId, "start_to_food").then(drawResult_spon, drawResultErrBack);
        gp_spon.getResultData(result.jobId, "food_to_end ").then(drawResult_spon, drawResultErrBack);
        gp_spon.getResultData(result.jobId, "rest_sel ").then(drawResult_point_spon, drawResultErrBack);
	}

	function completeCallback_clip(result){
        gp_clip.getResultData(result.jobId, "Clip_bus_Project").then(drawResult_clip, drawResultErrBack);
	}

	function drawResult_point_bus(data) {
        var polygon_feature3 = data.value.features;
        for (fea in polygon_feature3) {
            polygon_feature3[fea].symbol = markerStops;
            busStopGraphicLayer.add(polygon_feature3[fea]);
            var template = {
                title: "Bus Stop",
                content: "Stop Location: {StopName}"
            };
            busStopGraphicLayer.popupTemplate = template;
        }

    }
    function drawResult_point_spon(data) {
        var polygon_feature3 = data.value.features;
        console.log(data)
        for (fea in polygon_feature3) {
            polygon_feature3[fea].symbol = markerStops_spon;
            restStopGraphicLayer.add(polygon_feature3[fea]);
            var template = {
                title: "Sponsored Restaurant",
                content: "Restaurant: {Field1}"
            };
            restStopGraphicLayer.popupTemplate = template;
        }
    }

	function drawResult(data){
        var polygon_feature3 = data.value.features;
        for (fea in polygon_feature3){
            polygon_feature3[fea].symbol = uber_color;
            uber_len.push(polygon_feature3[fea].attributes)
            polygon_feature3[fea].attributes.cus_id = 'uber';
            uberGraphicLayer.add(polygon_feature3[fea]);
        }
         if (last_fun == 'uber'){
            finishedLoading()
        }
        console.log(uberGraphicLayer)
	}


    function drawResult_spon(data){
        var polygon_feature3 = data.value.features;
        for (fea in polygon_feature3){
            polygon_feature3[fea].symbol = sponsored_color;
            spon_len.push(polygon_feature3[fea].attributes)
            polygon_feature3[fea].attributes.cus_id = 'spon';
            sponGraphicLayer.add(polygon_feature3[fea]);
        }
        if (last_fun == 'spon'){
            finishedLoading()
        }
	}

	function drawResult_bus(data){
        var polygon_feature3 = data.value.features;
        for (fea in polygon_feature3){
           polygon_feature3[fea].symbol = bus_routes_color;
            bus_len.push(polygon_feature3[fea].attributes)
            polygon_feature3[fea].attributes.cus_id = 'bus';
            busGraphicLayer.add(polygon_feature3[fea]);
        }
         if (last_fun == 'bus'){
            finishedLoading()
        }
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

    function startLoading(){
	    $(".btn ").prop('disabled',true);
	    $(".chkbox ").prop('disabled',true);
        $("#loader_map").show();
        $("#viewDiv").hide()
    }

    function finishedLoading(){
        console.log('all routes loaded')
        process_output()
        $(".btn ").prop('disabled',false);
        $(".chkbox ").prop('disabled',false);

        $("#loader_map").hide();

        $("#viewDiv").show()
    }
    function process_output(){
	    var uber_dis = 0
        for (shape in uber_len){
            uber_dis = uber_dis + uber_len[shape].Shape_Length
        }
        var bus_dis = 0
        for (shape in bus_len){
            bus_dis = bus_dis + bus_len[shape].Shape_Length
        }
        var spon_dis = 0
        for (shape in spon_len){
            spon_dis = spon_dis + spon_len[shape].Shape_Length
        }


        if($("#uberChk").is(':checked')){
            $('#uber_main').show()

	        var value = timediscost('uber', uber_dis)
            console.log('afsadfds')
	        var uber_table = "<td></td>\n" +
            "        <td>\n" +
            "        <table >\n" +
            "            <tr>\n" +
            "                <td>Time</td>\n" +
            "                <td>"+value[0]+"</td>\n" +
            "                <td>minutes</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Distance</td>\n" +
            "                <td>"+value[1]+"</td>\n" +
            "                <td>miles</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Cost</td>\n" +
            "                <td>"+value[2]+"</td>\n" +
            "                <td>$</td>\n" +
            "            </tr>\n" +
            "        </table>\n" +
            "        </td>"
            $('#uber_add').html(uber_table)
            $('#uber_add').show()
        }
        if($("#redFareChk").is(':checked')){
	        $('#spon_main').show()
            $('#spon_add').show()
            $('#spon_stop_main').show()
	        var value = timediscost('spon', spon_dis)
	        var spon_table = "<td></td>\n" +
            "        <td>\n" +
            "        <table >\n" +
            "            <tr>\n" +
            "                <td>Time</td>\n" +
            "                <td>"+value[0]+"</td>\n" +
            "                <td>minutes</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Distance</td>\n" +
            "                <td>"+value[1]+"</td>\n" +
            "                <td>miles</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Cost</td>\n" +
            "                <td>"+value[2]+"</td>\n" +
            "                <td>$</td>\n" +
            "            </tr>\n" +
            "        </table>\n" +
            "        </td>"
            $('#spon_add').html(spon_table)
        }
        if($("#busesChk").is(':checked')){
            $('#bus_main').show()
            $('#bus_add').show()
            $('#bus_stop_main').show()
	        var value = timediscost('bus', bus_dis)
	        var bus_table = "<td></td>\n" +
            "        <td>\n" +
            "        <table >\n" +
            "            <tr>\n" +
            "                <td>Time</td>\n" +
            "                <td>"+value[0]+"</td>\n" +
            "                <td>minutes</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Distance</td>\n" +
            "                <td>"+value[1]+"</td>\n" +
            "                <td>miles</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Cost</td>\n" +
            "                <td>"+value[2]+"</td>\n" +
            "                <td>$</td>\n" +
            "            </tr>\n" +
            "        </table>\n" +
            "        </td>"
            $('#bus_add').html(bus_table)
        }
    }
    function timediscost(route_type, distance){
	    var uber_cost_mile = parseFloat($("#uberCost").val());
	    var uber_cost_min = parseFloat($("#uberCost_min").val());
	    var uber_cost_base = parseFloat($("#uberCost_base").val());
        var avg_speed = parseFloat($("#averSpeed").val());
        var bus_cost = parseFloat($("#busCost").val());
        var distance_con = distance *0.000621371
        var time = 0;
        var cost = 0;
	    if(route_type =='uber'){
            time = distance_con/avg_speed*60;
            cost = uber_cost_base+uber_cost_mile*distance_con+uber_cost_min*time
        }
        else if(route_type =='spon'){
	        time = distance_con/avg_speed*60+20
            cost = 0

        }
        else if(route_type =='bus'){
	        time = 1.1*(distance_con/avg_speed*60);
            cost = bus_cost
        }
        time = time.toFixed(2)
        distance_con = distance_con.toFixed(2)
        cost = cost.toFixed(2)
        return[time, distance_con, cost]
    }
    app = {
            // bufferPoint:bufferPoint,
        createPoint:createPoint,
        getRoutes:getRoutes
    };
}

ready(init)
});
$('tr').hide();
$('#origin').show()
$('#destination').show()
$('#opt_toggle').click(function() {

    if($('#demo').attr("class")=='collapse in'){
        $(this).html('<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>');
    }
    else{

        $(this).html('<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>');
    }
})
$('.gly').click(function() {
    console.log(this)
    console.log(this.name)
    $('#'+this.name+'_add').toggle()
})
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
