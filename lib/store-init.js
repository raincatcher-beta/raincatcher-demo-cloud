
var config = require('./config.js');
var SimpleStore = require('fh-wfm-simple-store')({persistent: config.get('persistentStore')});

/**
 * Creates and initializes a store to be used by the app modules.
 * @param {String} dataSetId  String used as an identifier for the store
 * @param {Object|null} seedData  Object to be saved in the store initially
 * @param {Object} mediator Object used for listening to a topic.
 */
function initStore(dataSetId, seedData, mediator) {
  var dataStore = new SimpleStore(dataSetId);

  /**
   * Check if existing data exists. If no existing data is found, initialize with the given seed data. Otherwise,
   * continue to listen to topic.
   *
   * TODO: Check for existing data may be removed in production as applications are likely to start with no
   * initial data.
   *
   *
   * NOTE: Seed data are for demo purposes only.
   */
  return dataStore.list().then(function(storeData) {
    if (!storeData || storeData.length === 0) {
      //Check if seed data is given, otherwise initialize store with no initial data.
      //array store needs to be initialized with an empty array if there is no seed data given.
      if (!seedData && !config.get('persistentStore')) {
        seedData = [];
      }

      return dataStore.init(seedData).then(function() {
        return dataStore.listen(config.get('dataTopicPrefix'), mediator);
      });
    } else {
      return dataStore.listen(config.get('dataTopicPrefix'), mediator);
    }
  });
}

module.exports = {
  init: initStore
};