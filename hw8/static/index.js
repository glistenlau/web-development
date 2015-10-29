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
