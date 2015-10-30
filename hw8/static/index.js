/**
 * Created by YiLIU on 10/28/15.
 */
var getIcon = function(icon) {
    var path = "/static/images/";
    switch (icon) {
        case "clear-day":
            return path + "clear.png";
        case "clear-night":
            return path + "clear_night.png";
        case "rain":
            return path + "rain.png";
        case "snow":
            return path + "snow.png";
        case "sleet":
            return path + "sleet.png";
        case "wind":
            return path + "wind.png";
        case "fog":
            return path + "fog.png";
        case "cloudy":
            return path + "cloudy.png";
        case "partly-cloudy-day":
            return path + "cloud_day.png";
        case "partly-cloudy-night":
            return path + "cloud_night.png";
    }

};

//var createWeatherMap = function(lon, lat) {
//    var map = new ol.Map({
//        view: new ol.View({
//            center: ol.proj.transform([-96.7128718, 33.0306995], 'EPSG:4326', 'EPSG:3857'),
//            zoom: 12
//        }),
//        layers: [
//            new ol.layer.Tile({
//                source: new ol.source.OSM()
//            }),
//            new ol.layer.Tile({
//                source: new ol.source.XYZ(
//                    "clouds",
//                    "http://{s}.tile.openweathermap.org/map/clouds/{z}/{x}/{y}.png",
//                    {
//                        isBaseLayer: false,
//                        opacity: 0.7,
//                        sphericalMercator: true
//                    }
//                )
//            }),
//            new ol.layer.Tile({
//                source: new OpenLayers.Layer.XYZ(
//                    "precipitation",
//                    "http://{s}.tile.openweathermap.org/map/precipitation/{z}/{x}/{y}.png",
//                    {
//                        isBaseLayer: false,
//                        opacity: 0.7,
//                        sphericalMercator: true
//                    }
//                )
//            })
//
//    ],
//    target: 'map'
//});
    //Center of map
//    var lonlat = new OpenLayers.LonLat(lon, lat);
//
//    var map = new OpenLayers.Map({
//        div: "map",
//        center: lonlat.transform('EPSG:4326', 'EPSG:3857'),
//    });
//    // Create OSM overlays
//    var mapnik = new OpenLayers.Layer.OSM();
//
//    var layer_cloud = new OpenLayers.Layer.XYZ(
//        "clouds",
//        "http://${s}.tile.openweathermap.org/map/clouds/${z}/${x}/${y}.png",
//        {
//            isBaseLayer: false,
//            opacity: 0.7,
//            sphericalMercator: true
//        }
//    );
//
//    var layer_precipitation = new OpenLayers.Layer.XYZ(
//        "precipitation",
//        "http://${s}.tile.openweathermap.org/map/precipitation/${z}/${x}/${y}.png",
//        {
//            isBaseLayer: false,
//            opacity: 0.7,
//            sphericalMercator: true
//        }
//    );
//
//
//    map.addLayers([mapnik, layer_precipitation, layer_cloud]);
//};


$.validator.setDefaults({
    submitHandler: function() {
        $.get("/api/weather", $("form#searchForm").serialize(), function(data) {
            var location = $("input#city").val() + ", " + $("select#state").val();
            var degreeType = $("input:radio[name=degreeType]").val() === "us"? "ºF": "ºC";
            var nowInfo = [];
            nowInfo.push(getIcon(data.currently.icon));
            nowInfo.push(data.currently.summary + " in " + location);
            nowInfo.push(parseInt(data.currently.temperature));
            nowInfo.push("H: " + parseInt(data.daily.data[0].temperatureMax) + "º | " + parseInt(data.daily.data[0].temperatureMin) + "º");
            nowInfo.push()
            $("#nowIcon").attr("src", nowInfo[0]);
            $("#nowLocation").text(nowInfo[1]);
            $("#nowTemp").text(nowInfo[2]);
            $(".degreeType").text(degreeType);
            $("#nowRange").text(nowInfo[3]);
            lonlat = new OpenLayers.LonLat(data.longitude, data.latitude);
            map.setCenter(lonlat.transform('EPSG:4326', 'EPSG:3857'), 12);

            $("div#result").show()
        });
    }

});

$.validator.addMethod("noEmptyInput", function(value, element, params) {
    value = value.trim();
    if (value.length < 1) {
        return false;
    }

    return true;
});

$().ready(function() {
    $("#searchForm").validate({
        rules: {
            streetAddress: "noEmptyInput",
            city: "noEmptyInput",
            state: "noEmptyInput"
        },
        messages: {
            streetAddress: "Please enter the street address",
            city: "Please enter the city",
            state: "Please select a state"
        }
    });
});
