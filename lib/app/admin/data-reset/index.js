var create = require('./create');
var remove = require('./remove');
var resetUsers  = require('./reset-users');

/**
 * Returns resetData function singleton
 * @param {Object} mediator  - mediator object used for communication
 * @returns {Function} reset data function
 */
module.exports = function getResetDataFn(mediator) {
  var buildDataFunction = create.getBuildDataFunction(mediator);

  /**
   * This removes all items for all types,
   * then it rebuilds dataset using sample data (./data-demo) and updates its ID relations mappings,
     * then it calls auth service to reset all users back to sample data set:
     * https://github.com/feedhenry-raincatcher/raincatcher-demo-auth/blob/master/lib/data.json
   */
  return function() {
    return remove.removeData(mediator)
      .then(buildDataFunction)
      .then(resetUsers);
  };

};


