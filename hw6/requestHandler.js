/**
 * Created by YiLIU on 10/26/15.
 */

'use strict';

const GOOGLE_KEY= "AIzaSyDdhosspZ6NYYHaBIDtMsLtPBGD-j5FRGU";
var https = require('https');
var xml2js = require('xml2js');
var querystring = require('querystring');
var fs = require('fs');
var startTime;

exports.handleImage = function(path, callback) {
    fs.readFile("." + path, function(err, data) {
        if (err) {
            return callback(err);
        }
        return callback(null, data);
    });
};

exports.handleQuery = function(queries, callback) {
    queryToDict(queries, function(err, infoDict) {
        if (err) {
            return callback(err);
        }

        queryGeocode(infoDict, function(err, location) {
            if (err) {
                return callback(err);
            }

            queryForecast(infoDict, location, function(err, weather) {
                if (err) {
                    return callback(err);
                }

                showHTML(infoDict, weather, function(err, HTML) {
                    if (err) {
                        return callback(err);
                    }

                    return callback(null, HTML);
                })
            })
        });
    });

};

var queryToDict = function(queries, callback) {
    var dict = {};
    var list = queries.split('&');
    for (var query of list) {
        var keyValue = query.split('=');
        dict[keyValue[0]] = keyValue[1];
    }

    return callback(null, dict);
};

var queryGeocode = function(infoDict, callback) {
    let geoUrl = "https://maps.googleapis.com/maps/api/geocode/xml?address=" + infoDict.streetAddress + "," +
        infoDict.city + "," + infoDict.state + "&key=" + GOOGLE_KEY;

    https.get(geoUrl, function(res) {
        var xmlRes = ""

        console.log("Google Geocode responseSatus: ", res.statusCode);

        res.on('data', function(data) {
            xmlRes += data.toString();
        });

        res.on('end', function() {
            xml2js.parseString(xmlRes, function(err, result) {
                return callback(null, result.GeocodeResponse.result[0].geometry[0].location[0]);
            });
        });

    }).on("error", function(err) {
        return callback(err);
    });
};

var queryForecast = function(infoDict, location, callback) {
    let fcUrl = "https://api.forecast.io/forecast/473660d9a99fc4416b3d36a8a93b7ad7/" + location.lat[0] + "," + location.lng[0] + "?units=" + infoDict.degreeType + "&exclude=flags";
    let jsonStr = "";
    https.get(fcUrl, function(res) {
        console.log("Forecast.io responseSatus: ", res.statusCode);
        res.on('data', function(data) {
            jsonStr += data;
        });

        res.on('end', function() {
            //let weather = JSON.parse(jsonStr);
            callback(null, JSON.parse(jsonStr));
        });
    }).on("error", function(err) {
        return callback(err);
    });
};

var showHTML = function(infoDict, weather, callback) {
    fs.readFile("./weather.html", "utf-8", function(err, data) {
        if (err) {
            return callback(err);
        }
        let icon = getIcon(weather.currently.icon);
        //noinspection JSValidateTypes
        let temperature = weather.currently.temperature + (infoDict.degreeType === "us"? " Fº": " Cº");
        let condition = weather.currently.summary;

        let e = [
            getPrecipitation(weather.currently.precipIntensity),
            (weather.currently.precipProbability * 100) + "%",
            parseInt(weather.currently.windSpeed) + "mph",
            parseInt(weather.currently.dewPoint),
            (weather.currently.humidity * 100) + "%",
            parseInt(weather.currently.visibility) + "mi",
            getTime(weather.daily.data[0].sunriseTime),
            getTime(weather.daily.data[0].sunsetTime)
        ];

        let HTML = String.format(data, e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], icon, condition, temperature);
        return callback(null, HTML);
    })
}

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
}

var getTime = function(time) {
    let t = new Date(time * 1000);
    let hour = t.getHours() > 12? t.getHours() - 12: t.getHours();
    let minute = t.getMinutes();
    let sign = t.getHours() >= 12? "PM": "AM";

    return ("00" + hour).slice(-2) + ": " + ("00" + minute).slice(-2) + " " + sign;
};

var getIcon = function(icon) {
    switch(icon) {
        case "clear-day": return "/images/clear.png";
        case "clear-night": return "/images/clear_night.png";
        case "rain": return "/images/rain.png";
        case "snow": return "/images/snow.png";
        case "sleet": return "/images/sleet.png";
        case "wind": return "/images/wind.png";
        case "fog": return "/images/fog.png";
        case "cloudy": return "/images/cloudy.png";
        case "partly-cloudy-day": return "/images/cloud_day.png";
        case "partly-cloudy-night": return "images/cloud_night.png";
        default: return "/#";
    }
}

exports.handleHome = function(res, callback) {
    fs.readFile("./forecast_search.html", 'utf-8', function(err, data) {
        if (err) {
            return callback(err);
        }
        return callback(null, data);
    });
};

String.format = function(src){

    if (arguments.length == 0) return null;

    var args = Array.prototype.slice.call(arguments, 1);

    return src.replace(/\{(\d+)\}/g, function(m, i){

        return args[i];

    });

};
