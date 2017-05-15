var MongoClient = require('mongodb').MongoClient;
var Promise = require('bluebird');
var SYNC_COLLECTIONS = require('./constants').SYNC_COLLECTIONS;



module.exports = function() {
  return MongoClient.connect(process.env.FH_MONGODB_CONN_URL)
    .then(dropSyncCollections);
};

/**
 * Drops collections created by fh-mbaas-api/sync
 * @param db mongodb database
 */
function dropSyncCollections(db) {
  return Promise.each(SYNC_COLLECTIONS, function(collection) {
    db.collection(collection).drop();
  });
}