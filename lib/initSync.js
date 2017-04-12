var config = require('./config');
var globalCollisionHandler = require('./data_collision_handlers/globalHandler');

var wfmSync = require('fh-wfm-sync/lib/server');

/**
 *
 * Initialising sync handlers
 *
 * @param mediator
 * @param mbaasApi
 * @param useMongooseStore
 */
module.exports = function initSync(mediator, mbaasApi, useMongooseStore) {
  var syncOptions =   config.get("syncOptions");
  syncOptions.dataCollisionHandler = globalCollisionHandler;

  /**
   *
   * We are using mongoose models that have a `updatedAt` field.
   *
   * This can be used to detect if the record has changed.
   *
   * This is only used for mongoose. Otherwise, the default hashing functions are assigned.
   */
  if (useMongooseStore) {
    syncOptions.hashFunction = function generateHash(record) {
      return record.updatedAt ? new Date(record.updatedAt).getTime() : undefined;
    };
  }

//Initialising the fh-wfm-sync data sets for each module
  wfmSync.init(mediator, mbaasApi, 'workorders', syncOptions);
  wfmSync.init(mediator, mbaasApi, 'result', syncOptions);
  wfmSync.init(mediator, mbaasApi, 'workflows', syncOptions);
  wfmSync.init(mediator, mbaasApi, 'messages', syncOptions);
};