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
app.use('/api', bodyParser.json({limit: '10mb'}));
app.use('/api', router);

// setup the wfm routes
require('fh-wfm-workorder/server')(mediator, app, mbaasApi);
require('fh-wfm-workflow/router')(mediator, app);
require('fh-wfm-user/router')(mediator, app);

// app modules
require('./app/workorder')(mediator);
require('./app/workflow')(mediator);
require('./app/user')(mediator);

// fhlint-end

// Important that this is last!
app.use(mbaasExpress.errorHandler());

module.exports = exports = app;
