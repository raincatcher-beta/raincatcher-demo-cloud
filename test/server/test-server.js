'use strict';

require('dotenv').config({path: './test/server/gamma.env'});
process.env.FH_USE_LOCAL_DB=true;
// console.log(process.env)

var mbaasApi = require('fh-mbaas-api')
  , express = require('express')
  , cc = require('config-chain')
  , cors = require('cors')
  , mediator = require('fh-wfm-mediator/lib/mediator')
  , http = require('http')
  , syncConfig = require('../test-config')
  ;

var app = express()
  , mbaasExpress = mbaasApi.mbaasExpress()
  ;

var config = cc({}).add({
  IP: process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'
, PORT: process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8102
});

app.set('port', config.get('PORT'));
app.set('base url', config.get('IP'));

// Enable CORS for all requests
app.use(cors());

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys([]));
app.use('/mbaas', mbaasExpress.mbaas);

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

// fhlint-begin: custom-routes
app.use('/box/srv/1.1/app/init', function(req, res) { // specify the cloud host URL invoked by $fh init
  res.json({
    hosts: {url: 'http://localhost:8102'}
  });
});

// register our object handler
var ObjectManager = require('./object-manager');
var managers = {};

// setup the sync
var sync = require('../../lib/server.js');

app.get('/sync/init/:datasetId', function(req, res) {
  var datasetId = req.params.datasetId;
  managers[datasetId] = new ObjectManager(mediator, datasetId);
  sync.init(mediator, mbaasApi, datasetId, syncConfig.syncOptions)
  .then(function() {
    res.send();
  });
});

app.get('/sync/stop/:datasetId', function(req, res, next) {
  var datasetId = req.params.datasetId;
  console.log('\x1b[35m%s\x1b[0m', 'Stopping sync for:', datasetId);
  sync.stop(mbaasApi, datasetId)
  .then(function() {
    try {
      if (managers[datasetId]) {
        managers[datasetId].unsubscribe();
        delete managers[datasetId];
      }
      res.send();
    } catch (e) {
      next(e);
    }
  });
});

app.get('/sync/reset/:datasetId', function(req, res) {
  var datasetId = req.params.datasetId;
  console.log('\x1b[35m%s\x1b[0m', 'Resetting sync for:', datasetId);
  sync.stop(mbaasApi, datasetId)
  .then(function() {
    managers[datasetId].reset();
    return sync.init(mediator, mbaasApi, datasetId, syncConfig.syncOptions);
  })
  .then(function() {
    res.send();
  });
});

// Important that this is last!
app.use(mbaasExpress.errorHandler());

var server = http.createServer(app)
  , port  = app.get('port')
  , ip = app.get('base url')
  ;

server.listen(port, ip, function() {
  console.log("App started at: " + new Date() + " on " + ip + ":" +port);
});
