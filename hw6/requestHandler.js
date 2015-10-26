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

    queryGeocode(queries, function(err, location) {
        if (err) {
            return callback(err);
        }

        queryForecast(location, function(err, weather) {
            if (err) {
                return callback(err);
            }
            return callback(null, weather);
        })
    });
};

var queryToDict = function(queries) {
    var dict = {};
    var list = queries.split('&');
    for (var query of list) {
        var keyValue = query.split('=');
        dict[keyValue[0]] = keyValue[1];
    }

    return dict;
};

var queryGeocode = function(queries, callback) {
    let infoDict = queryToDict(queries);
    let geoUrl = "https://maps.googleapis.com/maps/api/geocode/xml?address=" + infoDict.streetAddress + "," + infoDict.city + "," + infoDict.state + "&key=" + GOOGLE_KEY;

    https.get(geoUrl, function(res) {
        var xmlRes = "";

        res.on('data', function(data) {
            xmlRes += data.toString();
        });

        res.on('end', function() {
            xml2js.parseString(xmlRes, function(err, result) {
                callback(result.GeocodeResponse.result[0].geometry[0].location[0]);
            });
        });

    }).on("error", function(err) {
        console.error(err);
    });
};

var queryForecast = function(location, callback) {
    let fcUrl =
    let jsonStr = "";
    https.get(fcUrl, function(res) {
        console.log("responseSatus: ", res.statusCode);
        console.log("forecast response spend time: ", new Date().getTime() - startTime);
        res.on('data', function(data) {
            jsonStr += data;
        })

        res.on('end', function() {
            //let weather = JSON.parse(jsonStr);
            console.log("forecast spend time: ", new Date().getTime() - startTime);
            response.writeHead(200, {"Content-Type": "application/json"})
            response.write(jsonStr);
            response.end();
        })
    });
};

exports.handleHome = function(res) {
    fs.readFile("./forecast_search.html", 'utf-8', function(err, data) {
        if (err) {
            throw err;
        }


    });
};