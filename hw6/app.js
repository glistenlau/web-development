/**
 * Created by YiLIU on 10/25/15.
 */

'use strict';

const PORT = 8000;
const GOOGLE_KEY= "AIzaSyDdhosspZ6NYYHaBIDtMsLtPBGD-j5FRGU";
var http = require('http');
var https = require('https');
var url = require('url');
var xml2js = require('xml2js');
var querystring = require('querystring');

var server = http.createServer(function (request, response) {
    var location = requestHandler(request)


});
server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");

var queryToDict = function(queries) {
    var dict = {};
    var list = queries.split('&');
    for (var query of list) {
        var keyValue = query.split('=');
        dict[keyValue[0]] = keyValue[1];
    }

    return dict;
};

var requestHandler = function(req) {
    let queries = url.parse(req.url).query;
    let infoDict = queryToDict(queries);
    let geoUrl = "https://maps.googleapis.com/maps/api/geocode/xml?address=" + infoDict.streetAddress + "," + infoDict.city + "," + infoDict.state + "&key=" + GOOGLE_KEY;

    https.get(geoUrl, function(res) {
        var xmlRes = "";
        var location = {};

        res.on('data', function(data) {
            xmlRes += data.toString();
        });

        res.on('end', function() {
            xml2js.parseString(xmlRes, function(err, result) {
                location = result.GeocodeResponse.result[0].geometry[0].location[0];
            });

            let fcUrl = "https://api.forecast.io/forecast/473660d9a99fc4416b3d36a8a93b7ad7/" + location.lat[0] + "," + location.lng[0] + "?units=" + infoDict.degreeType + "&exclude=flags"
            https.get(fcUrl, function(res) {
                console.log("responseSatus: ", res.statusCode);
            });
        });

    }).on("error", function(err) {
        console.error(err);
    });
}

