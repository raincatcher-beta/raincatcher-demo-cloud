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
var mongooseStore = require('fh-wfm-mongoose-store');
var mongoUtil = require('./storage/mongoUtil');
var googleSheetStore = require('raincatcher-google-sheet-store');

require('./env-var-check');

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

require('fh-wfm-result/lib/cloud')(mediator);
require('fh-wfm-user/lib/cloud')(mediator, app, authServiceGuid);
require('fh-wfm-workflow/lib/cloud')(mediator);
require('fh-wfm-workorder/lib/cloud')(mediator);

// fhlint-end

mbaasApi.events.on('sync:ready', function() {
  initSync(mediator, mbaasApi);
});


module.exports = function() {
  //make sure that all app modules finish setting up


  //Getting a connection sting for a mongo database.
  //This is used for the mongoose store.
  return mongoUtil.getMongoURL().then(function(mongoConnectionString) {

    if (!mongoConnectionString) {
      console.log("Could not get a mongodb connection string. Raincatcher will not work. If running in a Dynofarm/FeedHenry MBaaS, ensure the database is upgraded");
      return Promise.resolve(app);
    }

    //Connecting to the mongoose store
    return mongooseStore.connect(mongoConnectionString)
      .then(function() {
        //Initialising the data handlers for this application
        console.log("Initializing storage for objects");
        return Promise.all([
          require('./app/workorder')(mediator),
          require('./app/result')(mediator),
          require('./app/workflow')(mediator),
          require('./app/group')(mediator),
          require('./app/file')(mediator, app)]);
      })
      .then(function() {
        // Important: errorHandler should be the last thing to be added to the express app.
        app.use(mbaasExpress.errorHandler());
        return Promise.resolve(app);
      });
  });

};