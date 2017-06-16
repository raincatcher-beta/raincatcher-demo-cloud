'use strict';

var mongooseStore = require('fh-wfm-mongoose-store');
var config = require('../config');
var dataTopicPrefix = config.get('dataTopicPrefix');
var initMockData = require('../storage/initMockData');
var workorders = require('../mockData/workorders');

module.exports = function(mediator) {
  // Rebase the workorder dates to today. This is used for demo purposes.
  var today = new Date();
  var tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  workorders.forEach(function(workorder, index) {
    var date = new Date(workorder.startTimestamp);
    var hours = date.getHours();
    var newDate = index < workorders.length *2 / 3 ? today : tomorrow;
    newDate.setHours(hours);
    workorder.startTimestamp = newDate.toString();
    workorder.finishTimestamp = tomorrow.toString();
  });

  return mongooseStore.getDAL('workorders').then(function(workordersMongooseStore) {
    return initMockData(workordersMongooseStore, workorders).then(function() {
      return workordersMongooseStore.listen(dataTopicPrefix, mediator);
    });
  });
};
