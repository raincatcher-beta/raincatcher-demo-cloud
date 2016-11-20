'use strict';
var express = require('express');

var app   = require('./lib/app.js')
  , http = require('http')
  , port  = app.get('port')
  , ip = app.get('base url')
  ;

// allow serving of static files from the public directory
app.use(express.static(__dirname + '/public'));


var server = http.createServer(app);
server.listen(port, ip, function() {
  console.log("App started at: " + new Date() + " on port: " + port);
});
