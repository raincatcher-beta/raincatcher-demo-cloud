/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';
/**
* Serve the mobile environment on it's own port
**/

var http = require('http')
  , express = require('express')
  , app = express()
  , port = 8081
  , ip = '0.0.0.0'
  ;

app.set('port', port);
app.set('base url', ip);
app.use(express.static(__dirname + '/../www'));

app.get('/cordova.js', function(req, res) {
  res.send("");
})

var server = http.createServer(app);
server.listen(port, ip);
console.log('Serving www/ on ' + ip + ':' + port);
