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
    let geoUrl = "https://maps.googleapis.com/maps/api/geocode/xml?address=" + infoDict.streetAddress + "," + infoDict.city + "," + infoDict.state + "&key=" + GOOGLE_KEY;

    https.get(geoUrl, function(res) {
        var xmlRes = "";

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
        console.log("responseSatus: ", res.statusCode);
        console.log("forecast response spend time: ", new Date().getTime() - startTime);
        res.on('data', function(data) {
            jsonStr += data;
        });

        res.on('end', function() {
            //let weather = JSON.parse(jsonStr);
            console.log("forecast spend time: ", new Date().getTime() - startTime);
            callback(null, jsonStr);
        });
    }).on("error", function(err) {
        return callback(err);
    });
};

exports.handleHome = function(res, callback) {
    fs.readFile("./forecast_search.html", 'utf-8', function(err, data) {
        if (err) {
            return callback(err);
        }
        return callback(null, data);
    });
};