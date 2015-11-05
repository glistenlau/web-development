/**
 * Created by YiLIU on 10/26/15.
 */

'use strict';

let GOOGLE_KEY;
let FORECAST_KEY;
var fs = require('fs');
var https = require('https');
var xml2js = require('xml2js');
var querystring = require('querystring');

var readKeys = function(callback) {
    fs.readFile('./exclude/keys.json', function(err, data) {
        if (err) {
            console.log(err);
        }

        return callback(null, JSON.parse(data));
    })
};

readKeys(function(err, keys) {
    GOOGLE_KEY = keys.GOOGLE_KEY;
    FORECAST_KEY = keys.FORECAST_KEY;
});

exports.handleStatic = function(pathname, callback) {
        let postfix = pathname.substring(pathname.indexOf(".") + 1);
        let type = "";
        switch (postfix) {
            case "css":
                type = "text/css";
                break;
            case "js":
                type = "text/javascript";
                break;
            case "jpg":
                type = "image/jpg";
                break;
            case "png":
                type = "image/png";
                break;
            default:
                return callback(Error());
        }
        fs.readFile("." + pathname, function(err, data) {
            if (err) {
                return callback(err);
            }
            return callback(null, data, type);
        });

};

exports.handleHome = function(callback) {
    fs.readFile("./index.html", 'utf-8', function(err, data) {
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

                return callback(null, weather);
            });
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
                var location = result.GeocodeResponse.result[0].geometry[0].location[0];
                location.address = result.GeocodeResponse.result[0].formatted_address[0];
                return callback(null, location);
            });
        });

    }).on("error", function(err) {
        return callback(err);
    });
};

var queryForecast = function(infoDict, location, callback) {
    let fcUrl = "https://api.forecast.io/forecast/" + FORECAST_KEY + "/" + location.lat[0] + "," +
        location.lng[0] + "?units=" + infoDict.degreeType + "&exclude=flags";
    let jsonStr = "";
    https.get(fcUrl, function(res) {
        console.log("Forecast.io responseSatus: ", res.statusCode);
        res.on('data', function(data) {
            jsonStr += data;
        });

        res.on('end', function() {
            //let weather = JSON.parse(jsonStr);
            jsonStr = '{' + '"address":"' + location.address + '",' + jsonStr.substring(1);
            callback(null, jsonStr);
        });
    }).on("error", function(err) {
        return callback(err);
    });
};

String.format = function(src){

    if (arguments.length == 0) return null;

    var args = Array.prototype.slice.call(arguments, 1);

    return src.replace(/\{(\d+)\}/g, function(m, i){

        return args[i];

    });

};
