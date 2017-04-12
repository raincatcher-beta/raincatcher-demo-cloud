var store = require('fh-wfm-mongoose-store');

/**
 *
 * Connecting to the mongoose store.
 *
 * @param connectionString
 * @returns {*}
 */
function connect(connectionString) {
  return store.connect(connectionString, {});
}

/**
 * Disconnecting from the mongoose store. Ensures the mongo connections are closed.
 */
function disconnect() {
  return store.disconnect();
}

/**
 *
 * @param dataSetId
 * @returns {*}
 */
function getCollectionStore(dataSetId) {
  return store.getDAL(dataSetId);
}

module.exports = {
  connect: connect,
  disconnect: disconnect,
  getCollectionStore: getCollectionStore
};