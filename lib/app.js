'use strict';

var mbaasApi = require('fh-mbaas-api')
  , express = require('express')
  , app = express()
  , mbaasExpress = mbaasApi.mbaasExpress()
  , config = require('./config')
  , cors = require('cors')
  , mediator = require('fh-wfm-mediator/lib/mediator')
  , bodyParser = require('body-parser')
  , Promise = require('bluebird')
  ;

require('fh-wfm-appform/lib/server')(mbaasApi);

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
app.post('/cloud/:datasetId', function(req, res) {
  res.send('ok');
});

// setup the wfm sync & routes
require('fh-wfm-file/lib/router')(mediator, app);
require('fh-wfm-message/lib/server')(mediator, app, mbaasApi);
require('fh-wfm-result/lib/server')(mediator, app, mbaasApi);
require('fh-wfm-user/lib/router/cloud')(mediator, app, authServiceGuid);
require('fh-wfm-workflow/lib/server')(mediator, app, mbaasApi);
require('fh-wfm-workorder/lib/server')(mediator, app, mbaasApi);

// fhlint-end


module.exports = function() {
  //make sure that all app modules finish setting up
  return Promise.all([
    require('./app/message')(mediator),
    require('./app/workorder')(mediator),
    require('./app/result')(mediator),
    require('./app/workflow')(mediator),
    require('./app/group')(mediator),
    require('./app/file')(mediator)]).then(function() {
      // Important: errorHandler should be the last thing to be added to the express app.
      app.use(mbaasExpress.errorHandler());
      return Promise.resolve(app);
    });
};