/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var _ = require('lodash');
var q = require('q');

var ArrayStore = function(datasetId, data) {
  this.data = data;
  this.datasetId = datasetId;
}

ArrayStore.prototype.create = function(object, ts) {
  var self = this;
  var deferred = q.defer();
  setTimeout(function() {
    object.id = self.data.length;
    self.data.push(object);
    console.log('Created object:', object);
    deferred.resolve(object);
  }, 0);
  return deferred.promise;
};

ArrayStore.prototype.read = function(id) {
  var self = this;
  var deferred = q.defer();
  setTimeout(function() {
    var object = _.find(self.data, function(_object) {
      return _object.id == id;
    });
    deferred.resolve(object);
  }, 0);
  return deferred.promise;
};

ArrayStore.prototype.update = function(object) {
  var self = this;
  var deferred = q.defer();
  setTimeout(function() {
    var index = _.findIndex(self.data, function(_object) {
      return _object.id == object.id;
    });
    self.data[index] = object;
    console.log('Saved object:', object);
    deferred.resolve(object);
  }, 0);
  return deferred.promise;
};

ArrayStore.prototype.delete = function(object) {
  var self = this;
  var deferred = q.defer();
  setTimeout(function() {
    var removals = _.remove(self.data, function(_object) {
      return object.id === _object.id;
    });
    var removed = removals.length ? removals[0] : null;
    deferred.resolve(removed);
  }, 0);
  return deferred.promise;
};

ArrayStore.prototype.list = function(filter) {
  var self = this;
  var deferred = q.defer();
  setTimeout(function() {
    var filterResults;
    if (filter) {
      filterResults = self.data.filter(function(object) {
        return object[filter.key] == filter.value;
      });
    } else {
      filterResults = self.data;
    };
    deferred.resolve(filterResults);
  }, 0);
  return deferred.promise;
};


ArrayStore.prototype.listen = function(topicPrefix, mediator) {
  var self = this;
  var topicCreate = topicPrefix + self.datasetId + ':create';
  console.log('Subscribing to mediator topic:', topicCreate);
  mediator.subscribe(topicCreate, function(object, ts) {
    self.create(object, ts).then(function(object) {
      mediator.publish('done:' + topicCreate + ':' + ts, object);
    });
  });

  var topicLoad = topicPrefix + self.datasetId + ':load';
  console.log('Subscribing to mediator topic:', topicLoad);
  mediator.subscribe(topicLoad, function(id) {
    self.read(id).then(function(object) {
      mediator.publish('done:' + topicLoad + ':' + id, object);
    });
  });

  var topicSave = topicPrefix + self.datasetId + ':save';
  console.log('Subscribing to mediator topic:', topicSave);
  mediator.subscribe(topicSave, function(object) {
    self.update(object).then(function(object) {
      mediator.publish('done:' + topicSave + ':' + object.id, object);
    });
  });

  var topicDelete = topicPrefix + self.datasetId + ':delete';
  console.log('Subscribing to mediator topic:', topicDelete);
  mediator.subscribe(topicDelete, function(object) {
    self.delete(object).then(function(object) {
      mediator.publish('done:' + topicDelete + ':' + object.id, object);
    });
  });

  var topicList = topicPrefix + self.datasetId + ':list:load';
  console.log('Subscribing to mediator topic:', topicList);
  mediator.subscribe(topicList, function(queryParams) {
    var filter = queryParams && queryParams.filter || {};
    self.list().then(function(list) {
      mediator.publish('done:' + topicList, list);
    });
  });
}

module.exports = ArrayStore;
