var config = require('./config');
var _ = require('lodash');
var globalCollisionHandler = require('./data_collision_handlers/globalHandler');
var hashFunctions = require('./hash-functions');
var wfmSync = require('fh-wfm-sync/lib/server');

var SYNC_DATASETS = ['workorders', 'result', 'workflows'];

/**
 *
 * Initialising sync handlers for the data sets managed by sync.
 *
 * @param mediator
 * @param mbaasApi
 */
module.exports = function initSync(mediator, mbaasApi) {

  var syncOptions = config.get("syncOptions");
  syncOptions.dataCollisionHandler = globalCollisionHandler;

  // set sync config to report to influx db if metrics enabled
  var syncMetrics = config.get("syncMetrics");
  if (process.env.METRICS_ENABLED === 'true') {
    console.log("Enabling sync metrics with config: ", syncMetrics);
    mbaasApi.sync.setConfig(syncMetrics);
  }

  _.each(SYNC_DATASETS, function(dataSetId) {
    var _syncOptions = _.clone(syncOptions);

    _syncOptions.hashFunction = hashFunctions[dataSetId];

    //Initialising sync
    wfmSync.init(mediator, mbaasApi, dataSetId, _syncOptions);
  });
};