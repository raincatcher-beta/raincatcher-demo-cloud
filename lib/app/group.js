'use strict';

var mongooseStore = require('fh-wfm-mongoose-store');
var config = require('../config');
var dataTopicPrefix = config.get('dataTopicPrefix');
var Promise = require('bluebird');
var initMockData = require('../storage/initMockData');

var groups = require('../mockData/groups');

var membership = require('../mockData/membership');

module.exports = function(mediator) {

  var groupStoreInitPromise = mongooseStore.getDAL('group').then(function(groupMongooseStore) {

    return initMockData(groupMongooseStore, groups).then(function() {
      return groupMongooseStore.listen(dataTopicPrefix, mediator);
    });
  });

  var membershipStoreInitPromise = mongooseStore.getDAL('membership').then(function(membershipStore) {
    return initMockData(membershipStore, membership).then(function() {
      return membershipStore.listen(dataTopicPrefix, mediator);
    });
  });

  return Promise.all([groupStoreInitPromise, membershipStoreInitPromise]);
};
