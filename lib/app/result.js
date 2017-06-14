'use strict';

var mongooseStore = require('fh-wfm-mongoose-store');
var config = require('../config');
var dataTopicPrefix = config.get('dataTopicPrefix');
var Topic = require('fh-wfm-mediator/lib/topics');


module.exports = function(mediator) {

  var resultDataTopics = new Topic(mediator).prefix('wfm' + config.get('dataTopicPrefix')).entity('result');
  var workorderDataTopiocs = new Topic(mediator).prefix('wfm' + config.get('dataTopicPrefix')).entity('workorders');

  function handleWorkorderStatusUpdate(result) {
    if (result && result.status) {
      workorderDataTopiocs.publish('read', result.workorderId).then(function(workorder) {
        workorder.status = result.status;

        workorderDataTopiocs.publish('update', workorder);
      });
    }

    return null;
  }

  resultDataTopics.onDone('create', handleWorkorderStatusUpdate);

  resultDataTopics.onDone('update', handleWorkorderStatusUpdate);

  return mongooseStore.getDAL('result').then(function(resultMongooseStore) {
    return resultMongooseStore.listen(dataTopicPrefix, mediator);
  });
};
