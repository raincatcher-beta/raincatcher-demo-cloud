'use strict';

var app   = require('./app.js')
  , http = require('http')
  , port  = app.get('port')
  , ip = app.get('base url')
  ;

var tag = 'SERVER';

var server = http.createServer(app);
server.listen(port, ip);
console.log(tag, 'Listening on ' + ip + ':' + port);
