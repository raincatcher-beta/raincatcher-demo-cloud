var config = require('../config');
var SimpleStore = require('fh-wfm-simple-store')({persistent: config.get('persistentStore')});
var Promise = require('bluebird');

/**
 *
 * The simple store does not require an explicit connection step.
 *
 * @returns {*}
 */
function connect() {
  return Promise.resolve();
}

/**
 *
 * The simple store does not require an explicit connection step
 *
 * @returns {*}
 */
function disconnect() {
  return Promise.resolve();
}

/**
 *
 * Getting the store for a data set id
 *
 * @param dataSetId
 */
function getCollectionStore(dataSetId) {
  return Promise.resolve(new SimpleStore(dataSetId));
}

module.exports = {
  connect: connect,
  getCollectionStore: getCollectionStore,
  disconnect: disconnect
};