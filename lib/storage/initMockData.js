/**
 * Checking the stores to see if there is any data.
 *
 * If there is no existing data and seed Data is passed, then it will be initialised with the seed data.
 *
 * @param {Store} dataStore
 * @param {Array} seedData
 * @returns {Promise}
 */
module.exports = function initMockData(dataStore, seedData) {

  return dataStore.list().then(function(storeData) {

    //Only consider seeding data if there is no data in the collection already.
    if (!storeData || storeData.length === 0) {
      //Check if seed data is given, otherwise initialize store with no initial data.
      //array store needs to be initialized with an empty array if there is no seed data given.
      if (!seedData) {
        seedData = [];
      }

      return dataStore.init(seedData).then(function() {
        return dataStore;
      });
    }

    return dataStore;
  });
};