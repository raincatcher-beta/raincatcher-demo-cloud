'use strict';

var app = require('./lib/app.js')
  , http = require('http')
  ;

//Make sure all app modules are finished setting up before listening.
app().then(function(app) {
  var server = http.createServer(app);
  var port  = app.get('port'),
    ip = app.get('base url');

  server.listen(port, ip, function() {
    console.log("App started at: " + new Date() + " on port: " + port);
  });
});

