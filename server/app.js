'use strict';

var mbaasApi = require('fh-mbaas-api')
  , express = require('express')
  , app = express()
  , mbaasExpress = mbaasApi.mbaasExpress()
  , config = require('./config')
  , middle = require('./middleware')
  , mediator = require('fh-wfm-mediator/mediator')
  , bodyParser = require('body-parser')
  ;

var securableEndpoints = [];

app.set('port', config.get('PORT'));
app.set('base url', config.get('IP'));
app.use(middle.cors);

app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);

app.use(mbaasExpress.fhmiddleware());

// app.use(bodyParser.json({limit: '10mb'}));

// app specific router
var router = express.Router();
app.use('/api', router);

// setup the wfm routes
require('wfm-workorder/router')(mediator, app);
require('wfm-workflow/router')(mediator, app);

// app modules
require('./app/workorder')(mediator);
require('./app/workflow')(mediator);

// error handling
app.use(mbaasExpress.errorHandler());


module.exports = exports = app;
