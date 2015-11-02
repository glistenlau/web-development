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

var getPrecipitation = function(pi) {
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

var getTime = function(time) {
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

var getDateInfo = function(time) {
    var nextSeven = [];
    for (var i = 1; i <= 7; i++) {
        var t = new Date(time * 1000);
        t.setDate(t.getDate() + i);
        var date = {}
        date.day = getLiteralDay(t.getDay());
        date.month = getLiteralMonth(t.getMonth());
        date.date = t.getDate();
        nextSeven.push(date);
    }

    return nextSeven;
};

var getLiteralDay = function(day) {
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
    };
};

var getLiteralMonth = function(month) {
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

var setNow = function(data, degreeType) {
    var location = $("input#city").val() + ", " + $("select#state").val();
    var nowInfo = [];
    nowInfo.push(getIcon(data.currently.icon));
    nowInfo.push(data.currently.summary + " in " + location);
    nowInfo.push(parseInt(data.currently.temperature));
    nowInfo.push("H: " + parseInt(data.daily.data[0].temperatureMax) + "º | L: " + parseInt(data.daily.data[0].temperatureMin) + "º");
    nowInfo.push(getPrecipitation(data.currently.precipIntensity));
    nowInfo.push((data.currently.precipProbability * 100) + "%");
    nowInfo.push(parseInt(data.currently.windSpeed) + (degreeType === "us"? " mph": " m/s"));
    nowInfo.push(parseInt(data.currently.dewPoint) + (degreeType === "us"? " ºF": " ºC"));
    nowInfo.push((data.currently.humidity * 100) + "%");
    nowInfo.push(parseInt(data.currently.visibility) + (degreeType === "us"? " mi": " km"));
    nowInfo.push(getTime(data.daily.data[0].sunriseTime));
    nowInfo.push(getTime(data.daily.data[0].sunsetTime));
    $("#nowIcon").attr("src", nowInfo[0]);
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
    lonlat = new OpenLayers.LonLat(data.longitude, data.latitude);
    map.setCenter(lonlat.transform('EPSG:4326', 'EPSG:3857'), 10);
};

var setNextHours = function(data, degreeType) {
    var table = $("#nextHours");
    table.empty();
    table.append('<tr id="nextHoursTH"><th class="wh">Time</th><th class="wh">Summary</th><th class="wh">Cloud Cover' +
        '</th><th class="wh">Temp (<span class="degreeType"></span>)</th><th class="wh">View Details</th></tr>');
    for (var i = 1; i <= 24; i++) {
        var time = getTime(data.hourly.data[i].time);
        var summary = "<image src=" + getIcon(data.hourly.data[i].icon) + " width='30px' height='30px'/>";
        var cloudCover = parseInt(data.hourly.data[i].cloudCover) + "%";
        var temp = data.hourly.data[i].temperature;
        var viewMore = '<a role="button" data-toggle="collapse" href="#hour' + i +
            '" aria-expanded="false" aria-controls="' + 'hour' + i + '"><span class="glyphicon glyphicon-plus"></span></a>';
        table.append("<tr><td>" + time + "</td><td>" + summary + "</td><td>" + cloudCover + "</td><td>" + temp +
            "</td><td>" + viewMore + "</td></tr>");
        var windSpeed = data.hourly.data[i].windSpeed + (degreeType === "us"? " mph": " m/s");
        var humidity = data.hourly.data[i].humidity + "%";
        var visibility = data.hourly.data[i].visibility + (degreeType === "us"? " mi": " km");
        var pressure = data.hourly.data[i].pressure + (degreeType === "us"? " mb": " hPa");

        table.append('<tr class="collapse well" id="hour' + i + '"><td colspan="5"><table class="table table-hover" style="color: black;">' +
            '<tr><th>Wind</th><th>Humidity</th><th>Visibility</th><th>Pressure</th></tr>' +
            '<tr><td>' + windSpeed +'</td><td>' + humidity + '</td><td>' + visibility + '</td><td>' + pressure + '</td></tr>' +
            '</table></td></tr>');
    }
};

var setNextDays = function(data, degreeType) {
    var nextSeven = getDateInfo(data.currently.time);
    var daysTab = $("#daysRow");
    var emptyRowBefore = $("<div></div>")
    var emptyRowAfter = $("<div></div>")
    emptyRowBefore.addClass("hidden-xs col-md-2");
    emptyRowAfter.addClass("hidden-xs col-md-3");
    daysTab.empty();
    daysTab.append(emptyRowBefore);
    for (var i = 1; i <= 7; i++) {
        var row = $("<div></div>")
        var newRow = $('<div id="day' + i + '"></div>');
        row.addClass("col-xs-12 col-md-1");
        newRow.addClass("row daysBlock");
        newRow.append('<div class="col-xs-12 col-md-12 daysContent">' + nextSeven[i - 1].day + '</div>');
        newRow.append('<div class="col-xs-12 col-md-12 daysContent">' + nextSeven[i - 1].month + ' ' + nextSeven[i - 1].date + '</div></br></br>');
        newRow.append('<div class="col-xs-12 col-md-12 daysContent"><image height="65px" width="65px" src="' + getIcon(data.daily.data[i].icon) + '"/></div></br></br>');
        newRow.append('<div class="col-xs-12 col-md-12">Min</div>');
        newRow.append('<div class="col-xs-12 col-md-12 daysContent">Temp</div></br></br>');
        newRow.append('<div class="col-xs-12 col-md-12 tempDegree">' + parseInt(data.daily.data[i].temperatureMin) + 'º</div></br></br>');
        newRow.append('<div class="col-xs-12 col-md-12">Max</div>');
        newRow.append('<div class="col-xs-12 col-md-12 daysContent">Temp</div></br></br>');
        newRow.append('<div class="col-xs-12 col-md-12 tempDegree">' + parseInt(data.daily.data[i].temperatureMax) + 'º</div>');
        row.append(newRow);
        daysTab.append(row);
    }
    daysTab.append(emptyRowAfter);
}

$.validator.setDefaults({
    submitHandler: function() {
        $.get("/api/weather", $("form#searchForm").serialize(), function(data) {
            var degreeType = $("input[name=degreeType]:checked", "#searchForm").val();
            setNow(data, degreeType);
            setNextHours(data, degreeType);
            setNextDays(data, degreeType);
            $(".degreeType").text(degreeType === "us"? "ºF":"ºC");
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

var resetResult = function(form) {
    form.reset();
    $("#result").hide();
}
