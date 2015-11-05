/**
 * Created by YiLIU on 10/28/15.
 */

var getIcon = function (icon) {
    var path = "/forecast/static/images/";
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

var getPrecipitation = function (pi) {
    if (pi === 0) {
        return "None";
    } else if (pi === 0.002) {
        return "Very Light";
    } else if (pi === 0.017) {
        return "Light";
    } else if (pi === 0.1) {
        return "Moderate";
    } else {
        return "Heavy";
    }
};

var getTime = function (time) {
    var t = new Date(time * 1000);
    var hour = t.getHours();
    var minute = t.getMinutes();

    if (hour === 0) {
        ansHour = 12;
    } else if (hour > 12) {
        ansHour = hour - 12;
    } else {
        ansHour = hour;
    }

    if (hour === 24) {
        ansSign = "AM";
    } else if (hour > 11) {
        ansSign = "PM";
    } else {
        ansSign = "AM";
    }


    return ("00" + ansHour).slice(-2) + ": " + ("00" + minute).slice(-2) + " " + ansSign;
};

var getDateInfo = function (time) {
    var nextSeven = [];
    for (var i = 1; i <= 7; i++) {
        var t = new Date(time * 1000);
        t.setDate(t.getDate() + i);
        var date = {};
        date.day = getLiteralDay(t.getDay());
        date.month = getLiteralMonth(t.getMonth());
        date.date = t.getDate();
        nextSeven.push(date);
    }

    return nextSeven;
};

var getLiteralDay = function (day) {
    switch (day) {
        case 0:
            return "Sunday";
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday";
    }
    ;
};

var getLiteralMonth = function (month) {
    switch (month) {
        case 0:
            return "Jan";
        case 1:
            return "Feb";
        case 2:
            return "Mar";
        case 3:
            return "Apr";
        case 4:
            return "May";
        case 5:
            return "Jun";
        case 6:
            return "Jul";
        case 7:
            return "Aug";
        case 8:
            return "Sep";
        case 9:
            return "Oct";
        case 10:
            return "Nov";
        case 11:
            return "Dec";
    }
}

var setNow = function (data, degreeType) {
    var nowInfo = [];
    nowInfo.push(getIcon(data.currently.icon));
    nowInfo.push(" in " + data.address);
    nowInfo.push(parseInt(data.currently.temperature));
    nowInfo.push("H: " + parseInt(data.daily.data[0].temperatureMax) + "º | L: " +
        parseInt(data.daily.data[0].temperatureMin) + "º");
    nowInfo.push(getPrecipitation(data.currently.precipIntensity));
    nowInfo.push((data.currently.precipProbability * 100) + "%");
    nowInfo.push(parseInt(data.currently.windSpeed) + (degreeType === "us" ? " mph" : " m/s"));
    nowInfo.push(parseInt(data.currently.dewPoint) + (degreeType === "us" ? " ºF" : " ºC"));
    nowInfo.push((data.currently.humidity * 100) + "%");
    nowInfo.push(parseInt(data.currently.visibility) + (degreeType === "us" ? " mi" : " km"));
    nowInfo.push(getTime(data.daily.data[0].sunriseTime));
    nowInfo.push(getTime(data.daily.data[0].sunsetTime));

    $("div#result").css('display', 'block');
    $("#nowIcon").attr("src", nowInfo[0]);
    $("#nowSummary").text(data.currently.summary);
    $("#nowLocation").text(nowInfo[1]);
    $("#nowTemp").text(nowInfo[2]);
    $("#nowRange").text(nowInfo[3]);
    $("#nowPc").text(nowInfo[4]);
    $("#nowChanceRain").text(nowInfo[5]);
    $("#nowWindSpeed").text(nowInfo[6]);
    $("#nowDewPoint").text(nowInfo[7]);
    $("#nowHumidity").text(nowInfo[8]);
    $("#nowVisibility").text(nowInfo[9]);
    $("#nowSunrise").text(nowInfo[10]);
    $("#nowSunset").text(nowInfo[11]);
    if (map === null) {
        mapInit();
    }
    lonlat = new OpenLayers.LonLat(data.longitude, data.latitude);
    map.setCenter(lonlat.transform('EPSG:4326', 'EPSG:3857'), 10);
};

var setNextHours = function (data, degreeType) {
    var table = $("#nextHours");
    table.empty();
    table.append(
        '<tr id="nextHoursTH">' +
        '<th class="wh">Time</th>' +
        '<th class="wh">Summary</th>' +
        '<th class="wh">Cloud Cover</th>' +
        '<th class="wh">Temp (<span class="degreeType"></span>)</th>' +
        '<th class="wh">View Details</th>' +
        '</tr>');
    for (var i = 1; i <= 24; i++) {
        var time = getTime(data.hourly.data[i].time);
        var summary = "<image src=" + getIcon(data.hourly.data[i].icon) + " width='35px' height='35px'/>";
        var cloudCover = parseInt(data.hourly.data[i].cloudCover) + "%";
        var temp = data.hourly.data[i].temperature;
        var viewMore =
            '<a role="button" data-toggle="collapse" href="#hour' + i + '" aria-expanded="false" aria-controls="' +
            'hour' + i + '">' +
            '<span class="glyphicon glyphicon-plus"></span>' +
            '</a>';
        table.append(
            "<tr>" +
            "<td>" + time + "</td>" +
            "<td>" + summary + "</td>" +
            "<td>" + cloudCover + "</td>" +
            "<td>" + temp + "</td>" +
            "<td>" + viewMore + "</td>" +
            "</tr>");
        var windSpeed = data.hourly.data[i].windSpeed + (degreeType === "us" ? " mph" : " m/s");
        var humidity = data.hourly.data[i].humidity + "%";
        var visibility = data.hourly.data[i].visibility + (degreeType === "us" ? " mi" : " km");
        var pressure = data.hourly.data[i].pressure + (degreeType === "us" ? " mb" : " hPa");

        table.append(
            '<tr class="collapse well" id="hour' + i + '">' +
            '<td colspan="5">' +
            '<table class="table table-hover" style="color: black;">' +
            '<tr>' +
            '<th>Wind</th>' +
            '<th>Humidity</th>' +
            '<th>Visibility</th>' +
            '<th>Pressure</th>' +
            '</tr>' +
            '<tr>' +
            '<td>' + windSpeed + '</td>' +
            '<td>' + humidity + '</td>' +
            '<td>' + visibility +
            '</td>' +
            '<td>' + pressure + '</td>' +
            '</tr>' +
            '</table>' +
            '</td>' +
            '</tr>');
    }
};

var setNextDays = function (data, degreeType) {
    var nextSeven = getDateInfo(data.currently.time);
    var daysTab = $("#daysRow");
    var emptyRowBefore = $("<div></div>")
    var emptyRowAfter = $("<div></div>")
    emptyRowBefore.addClass("hidden-xs col-md-2");
    emptyRowAfter.addClass("hidden-xs col-md-3");
    daysTab.empty();
    daysTab.append(emptyRowBefore);
    for (var i = 1; i <= 7; i++) {
        // add modal button
        var button = $('<button type="button" style="width: 100%" id="day' + i +
            '" data-toggle="modal" data-target="#dayDetail' + i + '"></button>');
        var row = $('<div class="col-xs-12 col-md-1 daysBlock"></div>');
        var newRow = $('<div class="row"></div>');
        button.addClass("btn");
        // add day infomation
        newRow.append('<div class="daysContent">' + nextSeven[i - 1].day + '</div>');
        // add date infomation
        newRow.append('<div class="daysContent">' + nextSeven[i - 1].month + ' ' + nextSeven[i - 1].date + '</div>');
        // add icon
        newRow.append('<div class="daysContent"><image height="75px" width="75px" src="' +
            getIcon(data.daily.data[i].icon) + '"/></div>');
        // add min temperature
        newRow.append('<div>Min</div>');
        newRow.append('<div class="daysContent">Temp</div>');
        newRow.append('<div class="daysContent tempDegree">' + parseInt(data.daily.data[i].temperatureMin) + 'º</div>');
        // add max temperature
        newRow.append('<div>Max</div>');
        newRow.append('<div class="daysContent">Temp</div>');
        newRow.append('<div class="daysContent tempDegree">' + parseInt(data.daily.data[i].temperatureMax) + 'º</div>');
        // attach the information to button
        button.append(newRow);

        var modal = $('<div id="dayDetail' + i + '" role="dialog" aria-labelledby="gridSystemModalLabel">');
        modal.addClass('modal fade');
        var modalDialog = $('<div class="modal-dialog" role="document"></div>');
        var modalContent = $('<div class="modal-content">');
        var modalHeader = $('<div class="modal-header" style="color: black">');

        // set the modal header
        modalHeader.append(
            '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
            '</button>');
        modalHeader.append('<h4 class="modal-title modalBlock textLeft" id="gridSystemModalLabel">Weather in ' +
            data.address + ' on ' + nextSeven[i - 1].month + ' ' + nextSeven[i - 1].date + '</h4>');

        // set the modal body
        var modalBody = $('<div class="modal-body"></div>');
        var modalRow = $('<div class="row"></div>');
        // add weather icon
        modalRow.append(
            '<div class="modalBlock">' +
            '<image height="200px" width="200px" src="' + getIcon(data.daily.data[i].icon) + '"/>' +
            '</div>');
        // add summary
        modalRow.append(
            '<div class="modalBlock">' +
            '<h3>' + nextSeven[i - 1].day + ': ' +
            '<span style="color: #FF9800">' + data.daily.data[i].summary + '</span>' +
            '</h3>' +
            '</div>');
        // add surise time
        modalRow.append(
            '<div class="col-xs-12 col-md-4 modalBlock">' +
            '<div style="color: black"><b>Sunrise Time</b></div>' +
            '<div style="color: black">' + getTime(data.daily.data[i].sunriseTime) + '</div>' +
            '</div>');
        // add sunset time
        modalRow.append(
            '<div class="col-xs-12 col-md-4 modalBlock">' +
            '<div style="color: black"><b>Sunset Time</b></div>' +
            '<div style="color: black">' + getTime(data.daily.data[i].sunsetTime) + '</div>' +
            '</div>');
        // add humidity
        modalRow.append(
            '<div class="col-xs-12 col-md-4 modalBlock">' +
            '<div style="color: black"><b>Humidity</b></div>' +
            '<div style="color: black">' + data.daily.data[i].humidity + '%' + '</div>' +
            '</div>');
        // add wind speed
        modalRow.append(
            '<div class="col-xs-12 col-md-4 modalBlock">' +
            '<div style="color: black"><b>Wind Speed</b></div>' +
            '<div style="color: black">' +
            data.daily.data[i].windSpeed + (degreeType === "us" ? " mph" : " m/s") +
            '</div>' +
            '</div>');
        // add visibility
        modalRow.append(
            '<div class="col-xs-12 col-md-4 modalBlock">' +
            '<div style="color: black"><b>Visibility</b></div>' +
            '<div style="color: black">' +
            data.daily.data[i].visibility + (degreeType === "us" ? " mi" : " km") +
            '</div>' +
            '</div>');
// add pressure
        modalRow.append(
            '<div class="col-xs-12 col-md-4 modalBlock">' +
            '<div style="color: black"><b>Pressure</b></div>' +
            '<div style="color: black">' +
            data.daily.data[i].pressure + (degreeType === "us" ? " mb" : " hpa") +
            '</div>' +
            '</div>');
        // append row to modal body
        modalBody.append(modalRow);
        // append modal header to modal content
        modalContent.append(modalHeader);
        // append modal body to modal content
        modalContent.append(modalBody);
        // append modal content to modal dialog
        modalDialog.append(modalContent);
        modal.append(modalDialog);
        row.append(button);
        row.append(modal);
        daysTab.append(row);
    }
    daysTab.append(emptyRowAfter);
};

// handle form submit
$.validator.setDefaults({
    submitHandler: function () {
        $.get("/forecast/api/weather", $("form#searchForm").serialize(), function (data) {

            var degreeType = $("input[name=degreeType]:checked", "#searchForm").val();
            var address = data.address.split(',');

            // get the location information
            if (address.length - 2 >= 0) {
                var temp = address[address.length - 2].split(' ');
                data.address = temp.length > 1 ? temp[1] : temp[0];
            }
            if (address.length - 3 >= 0) {
                data.address = address[address.length - 3].trim() + ", " + data.address;
            }

            // set three tabs
            setNow(data, degreeType);
            setNextHours(data, degreeType);
            setNextDays(data, degreeType);
            $(".degreeType").text(degreeType === "us" ? "ºF" : "ºC");

            // make the result visible
        });
    }

});

// add the validation rule for white space input
$.validator.addMethod("noEmptyInput", function (value, element, params) {
    value = value.trim();
    if (value.length < 1) {
        return false;
    }

    return true;
});

var map = null;
// check the validation of form
$(document).ready(function () {
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

    // load facebook SDK
    $.ajaxSetup({ cache: true });
    $.getScript('//connect.facebook.net/en_US/sdk.js', function(){
        FB.init({
            appId      : '886824564747949',
            xfbml      : true,
            version    : 'v2.5'
        });
    });
});

var mapInit = function() {
    var lonlat = new OpenLayers.LonLat(0, 0);

    map = new OpenLayers.Map({
        div: "map",
        center: lonlat.transform('EPSG:4326', 'EPSG:3857'),
    });
    // Create OSM overlays
    var mapnik = new OpenLayers.Layer.OSM();

    var layer_cloud = new OpenLayers.Layer.XYZ(
        "clouds",
        "http://${s}.tile.openweathermap.org/map/clouds/${z}/${x}/${y}.png",
        {
            isBaseLayer: false,
            opacity: 0.7,
            sphericalMercator: true
        }
    );

    var layer_precipitation = new OpenLayers.Layer.XYZ(
        "precipitation",
        "http://${s}.tile.openweathermap.org/map/precipitation/${z}/${x}/${y}.png",
        {
            isBaseLayer: false,
            opacity: 0.7,
            sphericalMercator: true
        }
    );


    map.addLayers([mapnik, layer_precipitation, layer_cloud]);
};
// reset the form and result
var resetResult = function (form) {
    form.reset();
    $("div#result").css('display', 'none');
};

// post current weato facebook
var fbPost = function() {
    FB.ui({
        method: 'feed',
        link: 'http://forecast.io/',
        name: 'Current Weather' + $('#nowLocation').text(),
        picture: $('#nowIcon').prop('src'),
        description: $('#nowSummary').text() + ' ' + $('#nowTemp').text() + $('.degreeType').text().substring(0, 2),
        caption: 'WEATHER INFOMATION FROM FORECAST.IO',
    }, function(response){
        // Debug response (optional)
        console.log(response);
    });
};
