/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var mbaasApi = require('fh-mbaas-api')
  , express = require('express')
  , app = express()
  , mbaasExpress = mbaasApi.mbaasExpress()
  , config = require('./config')
  , cors = require('cors')
  , mediator = require('fh-wfm-mediator/mediator')
  , bodyParser = require('body-parser')
  ;

require('fh-wfm-appform/server')(mbaasApi);

var authServiceGuid = process.env.WFM_AUTH_GUID;
var securableEndpoints = [];

app.set('port', config.get('PORT'));
app.set('base url', config.get('IP'));

// Enable CORS for all requests
app.use(cors());

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

// fhlint-begin: custom-routes

// app specific router
var router = express.Router();

app.use('/sys/info/ping', function(req, res) {
  res.send('ok.');
});
app.use('/api', bodyParser.json({limit: '10mb'}));
app.use('/box', bodyParser.json());
app.use('/api', router);

// setup the wfm sync & routes
require('fh-wfm-message/server')(mediator, app, mbaasApi);
require('fh-wfm-workorder/server')(mediator, app, mbaasApi);
require('fh-wfm-result/server')(mediator, app, mbaasApi);
require('fh-wfm-workflow/server')(mediator, app, mbaasApi);
require('fh-wfm-user/lib/router/cloud')(mediator, app, authServiceGuid);

// app modules
require('./app/message')(mediator)
require('./app/workorder')(mediator);
require('./app/result')(mediator);
require('./app/workflow')(mediator);
require('./app/group')(mediator);


// fhlint-end

// Important that this is last!
app.use(mbaasExpress.errorHandler());

module.exports = exports = app;
