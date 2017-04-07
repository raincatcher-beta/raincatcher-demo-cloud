var $fh = require('fh-mbaas-api');

/**
 * Gets mongodb connection information from $fh.db
 * Use Data Browser > Upgrade Database to get the connection information available
 */
function getMongoURL(cb) {
  // Check if direct mongo connection url exist (available after upgrading db) as mongoStore requires
  // direct url and will throw an error when trying to connect.
  $fh.db({
    act: 'connectionString'
  }, function(err, connectionString) {
    cb(err, connectionString);
  });
}

module.exports = {
  getMongoURL: getMongoURL
};