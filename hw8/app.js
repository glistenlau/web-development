/**
 * Created by YiLIU on 10/25/15.
 */

'use strict';

var fs = require('fs');
var url = require('url');
var http = require('http');
var requestHandler = require('./requestHandler');

const PORT = process.env.PORT || 3000;

var server = http.createServer(function (request, response) {
    let pathname = url.parse(request.url).pathname;
    let queries = url.parse(request.url).query;
    if (pathname === "/forecast/" && (queries == null || queries.length == 0)) {
        requestHandler.handleHome(function(err, html) {
            if (err) {
                return console.error(err);
            }
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(html);
            response.end();
        });
    } else if (pathname === "/forecast/api/weather") {
        requestHandler.handleQuery(queries, function(err, weather) {
            if (err) {
                return console.error(err);
            }
            response.writeHead(200, {"Content-Type": "application/json"});
            response.write(weather);
            response.end();
        });
    } else {
        requestHandler.handleStatic(pathname, function(err, image, type) {
            if (err) {
                response.statusCode = 404;
                response.end();
            } else {
                response.writeHead(200, {"Content-Type": type});
                response.write(image);
                response.end();
            }
        })
    }
});

server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");


