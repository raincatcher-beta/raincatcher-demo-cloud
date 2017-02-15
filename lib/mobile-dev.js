'use strict';
/**
* Serve the mobile environment on it's own port
**/

var http = require('http');
var express = require('express');
var app = express();
var port = 8081;
var ip = '0.0.0.0';

app.set('port', port);
app.set('base url', ip);
app.use(express.static(__dirname + '/../www'));

app.get('/cordova.js', function(req, res) {
  res.send("");
});

var server = http.createServer(app);
server.listen(port, ip);
console.log('Serving www/ on ' + ip + ':' + port);
