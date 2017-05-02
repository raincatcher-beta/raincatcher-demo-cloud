var config = require('./config');
var _ = require('lodash');
var globalCollisionHandler = require('./data_collision_handlers/globalHandler');
var hashFunctions = require('./hash-functions');
var wfmSync = require('fh-wfm-sync/lib/server');

var SYNC_DATASETS = ['workorders', 'result', 'workflows', 'messages'];

/**
 *
 * Initialising sync handlers for the data sets managed by sync.
 *
 * @param mediator
 * @param mbaasApi
 * @param useMongooseStore
 */
module.exports = function initSync(mediator, mbaasApi, useMongooseStore) {

  var syncOptions = config.get("syncOptions");
  syncOptions.dataCollisionHandler = globalCollisionHandler;

  _.each(SYNC_DATASETS, function(dataSetId) {
    var _syncOptions = _.clone(syncOptions);
    /**
     *
     * We are using mongoose models that have a `updatedAt` field.
     *
     * This can be used to detect if the record has changed.
     *
     * This is only used for mongoose. Otherwise, the default hashing functions are assigned.
     */
    if (useMongooseStore) {
      _syncOptions.hashFunction = hashFunctions[dataSetId];
    }

    //Initialising sync
    wfmSync.init(mediator, mbaasApi, dataSetId, _syncOptions);
  });
};