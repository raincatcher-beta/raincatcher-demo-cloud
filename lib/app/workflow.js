'use strict';

var mongooseStore = require('fh-wfm-mongoose-store');
var config = require('../config');
var dataTopicPrefix = config.get('dataTopicPrefix');
var initMockData = require('../storage/initMockData');
var workflows = require('../mockData/workflows');

module.exports = function(mediator) {
  return mongooseStore.getDAL('workflows').then(function(workflowsMongooseStore) {
    return initMockData(workflowsMongooseStore, workflows).then(function() {
      return workflowsMongooseStore.listen(dataTopicPrefix, mediator);
    });
  });
};
