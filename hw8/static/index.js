/**
 * Created by YiLIU on 10/28/15.
 */
$.validator.setDefaults({
    submitHandler: function() {
        $.get("/api/weather", $("form#searchForm").serialize(), function(data) {
            var city = $("input#city").val();
            var location = $("input#city").val() + ", " + $("select#state").val();
            var nowInfo = [];
            //nowInfo.append(getIcon(data.currently.summary));
            nowInfo.push(data.currently.summary + " in " + location);
            nowInfo.push(parseInt(data.currently.temperature));
            nowInfo.push("H: " + parseInt(data.daily.data[0].temperatureMax) + "º | " + parseInt(data.daily.data[0].temperatureMin) + "º");
            $("#location").text(nowInfo[0]);
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
