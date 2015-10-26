/**
 * Created by YiLIU on 10/25/15.
 */

'use strict';

var fs = require('fs');
var url = require('url');
var http = require('http');
var requestHandler = require('./requestHandler');

const PORT = 8000;

var server = http.createServer(function (request, response) {
    let queries = url.parse(request.url).query;
    if (queries === null || queries === "") {
        requestHandler.handleHome(response, function(err, html) {
            if (err) {
                return console.error(err);
            }
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(html);
            response.end();
        });
    } else {
        requestHandler.handleQuery(queries, function(err, weather) {
            if (err) {
                return console.error(err);
            }
            response.writeHead(200, {"Content-Type": "application/json"});
            response.write(weather);
            response.end();
        });
    }
});

server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");


