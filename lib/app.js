'use strict';

var mbaasApi = require('fh-mbaas-api');
var express = require('express');
var app = express();
var mbaasExpress = mbaasApi.mbaasExpress();
var config = require('./config');
var cors = require('cors');
require('./debugLogsEnablers');
var mediator = require('fh-wfm-mediator/lib/mediator');
var bodyParser = require('body-parser');
var Promise = require('bluebird');
var adminRouter = require('./app/admin/router')(mediator);
var initSync = require('./initSync');

require('./env-var-check');
require('fh-wfm-appform/lib/server')(mbaasApi);

var authServiceGuid = process.env.WFM_AUTH_GUID;
var securableEndpoints = [];

app.set('port', config.get('PORT'));
app.set('base url', config.get('IP'));

// Enable CORS for all requests
app.use(cors());

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys(securableEndpoints));
// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

//Ensuring that any requests to the endpoints must have valid sessions
//Otherwise, the requests will be rejected.
app.use('/mbaas/sync', bodyParser.json({limit: '10mb'}), require('fh-wfm-user/lib/cloud/middleware/validateSession')(mediator, mbaasApi, ['/authpolicy']));

app.use('/mbaas', mbaasExpress.mbaas);

// fhlint-begin: custom-routes

// app specific router
var router = express.Router();

app.use('/sys/info/ping', function(req, res) {
  res.send('ok.');
});
app.use('/api', bodyParser.json({limit: '10mb'}));
app.use('/box', bodyParser.json());
app.use('/api', router);


/**
 * admin router, handles requests to /admin/ endpoint
 * supported endpoints:
 * DELETE /admin/data-reset - resets solution data-reset to seed data-reset
 */
app.use('/admin', adminRouter);

app.post('/cloud/:datasetId', function(req, res) {
  res.send('ok');
});

var excludedPaths = ['/authpolicy', '/file'];
app.use(require('fh-wfm-user/lib/cloud/middleware/validateSession')(mediator, mbaasApi,excludedPaths));

require('fh-wfm-message/lib/server')(mediator, app, mbaasApi);
require('fh-wfm-result/lib/cloud')(mediator);
require('fh-wfm-user/lib/cloud')(mediator, app, authServiceGuid);
require('fh-wfm-workflow/lib/cloud')(mediator);
require('fh-wfm-workorder/lib/cloud')(mediator);

// fhlint-end

var store = require("./storage/storage-init");

module.exports = function() {
  //make sure that all app modules finish setting up
  var storagePromise = store.connect().then(function() {

    //Initialising the sync handlers for this application
    initSync(mediator, mbaasApi, store.usingMongooseStore());

    console.log("Initializing storage for objects");
    return Promise.all([
      require('./app/message')(mediator),
      require('./app/workorder')(mediator),
      require('./app/result')(mediator),
      require('./app/workflow')(mediator),
      require('./app/group')(mediator),
      require('./app/file')(mediator, app)]);
  });

  return storagePromise.then(function() {
    // Important: errorHandler should be the last thing to be added to the express app.
    app.use(mbaasExpress.errorHandler());
    return Promise.resolve(app);
  });
};