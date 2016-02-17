/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var app   = require('./lib/app.js')
  , http = require('http')
  , port  = app.get('port')
  , ip = app.get('base url')
  ;

var tag = 'SERVER';

var server = http.createServer(app);
server.listen(port, ip, function() {
  console.log("App started at: " + new Date() + " on port: " + port);
});
