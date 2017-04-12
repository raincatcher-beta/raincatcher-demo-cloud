var config = require('../config.js');
var mongooseStore = require('./mongoose-store');
var simpleStore = require('./simple-store');
var mongoUtils = require('./mongoUtil');
var Promise = require('bluebird');

var dataTopicPrefix = config.get('dataTopicPrefix');
var persistentStore = config.get('persistentStore');

var connectPromise, useMongooseStore;


/**
 * Creates and initializes a store to be used by the app modules.
 *
 * @param {String} dataSetId  String used as an identifier for the store
 * @param {Array|null} seedData  Objects to be saved in the store initially
 * @param {Object} mediator Object used for listening to a topic.
 */
function initStore(dataSetId, seedData, mediator) {

  if (!connectPromise) {
    return Promise.reject(new Error("Connect must be called before trying to initialise a store"));
  }

  return connectPromise.then(function() {
    var store = useMongooseStore ? mongooseStore : simpleStore;

    return store.getCollectionStore(dataSetId).then(function checkForInit(dataStore) {

      //Checking the collection to see if there is any data.
      //If there is no existing data and seed Data is passed, then it will be initialised with the seed data.
      return dataStore.list().then(function(storeData) {

        //Only consider seeding data if there is no data in the collection already.
        if (!storeData || storeData.length === 0) {
          //Check if seed data is given, otherwise initialize store with no initial data.
          //array store needs to be initialized with an empty array if there is no seed data given.
          if (!seedData && !persistentStore) {
            seedData = [];
          }

          return dataStore.init(seedData).then(function() {
            return dataStore;
          });
        }

        return dataStore;
      });
    }).then(function(dataStore) {
      //Initialisation complete, subscribe to any mediator topics
      return dataStore.listen(dataTopicPrefix, mediator);
    });
  });
}

/**
 *
 * Connecting to a mongoose store if available, otherwise default to the simple store.
 *
 * @returns {*|Promise}
 */
function connect() {
  connectPromise = connectPromise || Promise.fromCallback(function(callback) {
    mongoUtils.getMongoURL(callback);
  }).then(function(connectionUrl) {

    //If there is a mongo connection URL, then default to mongoose, otherwise use the simple store.
    if (connectionUrl) {
      useMongooseStore = true;
      return mongooseStore.connect(connectionUrl);
    } else {
      return simpleStore.connect();
    }
  });

  return connectPromise;
}


function disconnect() {

  connectPromise.then(function() {
    var promise = useMongooseStore ? mongooseStore.disconnect() : simpleStore.disconnect();

    return promise.then(function() {
      connectPromise = null;
      useMongooseStore = null;
    });
  });
}

module.exports = {
  init: initStore,
  connect: connect,
  disconnect: disconnect,
  usingMongooseStore: function() {
    return useMongooseStore === true;
  }
};