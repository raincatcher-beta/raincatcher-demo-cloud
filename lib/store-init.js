
var SimpleStore = require('fh-wfm-simple-store'),
  config = require('./config.js');

/**
 * Creates and initializes a store to be used by the app modules.
 * @param {String} dataSetId  String used as an identifier for the store
 * @param {Object|null} seedData  Object to be saved in the store initially
 * @param {Object} mediator Object used for listening to a topic.
 */
function initStore(dataSetId, seedData, mediator) {
  var dataStore = new SimpleStore(dataSetId);

  /**
   * Check if existing data exists. If no existing data is found, initialize with the given seed data.
   *
   * TODO: Check for existing data may be removed in production as applications are likely to start with no
   * initial data. Instead, initialize store with: dataStore.init();
   */
  dataStore.list().then(function(storeData) {
    if (!storeData || storeData.length === 0) {
      //Check if seed data is given, otherwise initialize store with no initial data.
      if (seedData) {
        dataStore.init(seedData);
      } else {
        dataStore.init();
      }
    }

    dataStore.listen(config.get('topicPrefix'), mediator);
  });
}

module.exports = {
  init: initStore
};
