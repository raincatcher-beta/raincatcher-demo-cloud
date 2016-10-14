'use strict';

var app   = require('./lib/app.js')
  , http = require('http')
  , port  = app.get('port')
  , ip = app.get('base url')
  ;

var server = http.createServer(app);
server.listen(port, ip, function() {
  console.log("App started at: " + new Date() + " on port: " + port);
});
