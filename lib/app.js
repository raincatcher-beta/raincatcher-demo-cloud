'use strict';

var mbaasApi = require('fh-mbaas-api')
  , express = require('express')
  , app = express()
  , mbaasExpress = mbaasApi.mbaasExpress()
  , config = require('./config')
  , cors = require('cors')
  , mediator = require('fh-wfm-mediator/lib/mediator')
  , bodyParser = require('body-parser')
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
// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

//Ensuring that any requests to the endpoints must have valid sessions
//Otherwise, the requests will be rejected.
app.use(require('fh-wfm-user/lib/middleware/validateSession')(mediator, mbaasApi, ['/authpolicy']));
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

// app modules
require('./app/message')(mediator);
require('./app/workorder')(mediator);
require('./app/result')(mediator);
require('./app/workflow')(mediator);
require('./app/group')(mediator);
require('./app/file')(mediator);

// fhlint-end

// Important that this is last!
app.use(mbaasExpress.errorHandler());

module.exports = exports = app;
