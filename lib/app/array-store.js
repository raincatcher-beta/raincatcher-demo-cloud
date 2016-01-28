'use strict';

var _ = require('lodash');

var ArrayStore = function(datasetId, data) {
  this.data = data;
  this.datasetId = datasetId;
}

ArrayStore.prototype.listen = function(mediator) {
  var self = this;
  var topicCreate = 'sync:' + self.datasetId + ':create';
  console.log('Subscribing to mediator topic:', topicCreate);
  mediator.subscribe(topicCreate, function(object) {
    setTimeout(function() {
      object.id = self.data.length;
      self.data.push(object);
      console.log('Created object:', object);
      mediator.publish('done:' + topicCreate + ':' + object.createdTs, object);
    }, 0);
  });

  var topicLoad = 'sync:' + self.datasetId + ':load';
  console.log('Subscribing to mediator topic:', topicLoad);
  mediator.subscribe(topicLoad, function(id) {
    setTimeout(function() {
      var object = _.find(self.data, function(_object) {
        return _object.id == id;
      });
      mediator.publish('done:' + topicLoad + ':' + id, object);
    }, 0);
  });

  var topicSave = 'sync:' + self.datasetId + ':save';
  console.log('Subscribing to mediator topic:', topicSave);
  mediator.subscribe(topicSave, function(object) {
    setTimeout(function() {
      var index = _.findIndex(self.data, function(_object) {
        return _object.id == object.id;
      });
      self.data[index] = object;
      console.log('Saved object:', object);
      mediator.publish('done:' + topicSave + ':' + object.id, object);
    }, 0);
  });

  var topicList = 'sync:' + self.datasetId + ':list:load';
  console.log('Subscribing to mediator topic:', topicList);
  mediator.subscribe(topicList, function() {
    setTimeout(function() {
      mediator.publish('done:' + topicList, self.data);
    }, 0);
  });
}

module.exports = ArrayStore;
