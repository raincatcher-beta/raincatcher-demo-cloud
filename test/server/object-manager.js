/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var _ = require('lodash')
  , config = require('../test-config')
  , testData = require('../test-data')
  ;

function ObjectManager(mediator, datasetId) {
  this.mediator = mediator;
  this.datasetId = datasetId;
  this.objects = [];
  this.reset();
  this.topic = {};
  this.subscription = {};

  var self = this;

  self.topic.list = 'sync:'+datasetId+':list:load';
  console.log('Subscribing to topic:', self.topic.list);
  this.subscription.list = mediator.subscribe(self.topic.list, function(queryParams) {
    var results;
    if (queryParams && queryParams.user) {
      console.log('Applying list filter:', queryParams);
      results = self.objects.filter(function(object) {
        return object.user === queryParams.user;
      })
    } else {
      results = self.objects;
    };
    console.log(self.topic.list, 'called');
    setTimeout(function() {
      mediator.publish('done:' + self.topic.list, results);
    }, 0);
  });

  self.topic.load = 'sync:'+datasetId+':load';
  console.log('Subscribing to topic:', self.topic.load);
  this.subscription.load = mediator.subscribe(self.topic.load, function(id) {
    console.log(self.topic.load, 'called');
    setTimeout(function() {
      var object = _.find(self.objects, function(_object) {
        return _object.id == id;
      });
      mediator.publish('done:' + self.topic.load + ':' + id, object);
    }, 0);
  });

  self.topic.save = 'sync:'+datasetId+':save';
  console.log('Subscribing to topic:', self.topic.save);
  this.subscription.save = mediator.subscribe(self.topic.save, function(object) {
    console.log(self.topic.save, 'called');
    setTimeout(function() {
      var index = _.findIndex(self.objects, function(_object) {
        return _object.id == object.id;
      });
      self.objects[index] = object;
      console.log('Saved object:', object);
      mediator.publish('done:' + self.topic.save + ':' + object.id, object);
    }, 0);
  });

  self.topic.create = 'sync:'+datasetId+':create';
  console.log('Subscribing to topic:', self.topic.create);
  this.subscription.create = mediator.subscribe(self.topic.create, function(object, timestamp) {
    console.log(self.topic.create, 'called');
    setTimeout(function() {
      object.id = self.objects.length;
      self.objects.push(object);
      console.log('Created object:', object);
      mediator.publish('done:' + self.topic.create + ':' + timestamp, object);
    }, 0);
  });

  self.topic.delete = 'sync:'+datasetId+':delete';
  console.log('Subscribing to topic:', self.topic.delete);
  this.subscription.delete = mediator.subscribe(self.topic.delete, function(uid) {
    console.log(self.topic.delete, 'called');
    setTimeout(function() {
      var index = _.findIndex(self.objects, function(_object) {
        return _object.id == uid;
      });
      self.objects.splice(index, 1);
      console.log('Deleted object id:', uid);
      mediator.publish('done:' + self.topic.delete + ':' + uid, 'Delete successful');
    }, 0);
  });
}

ObjectManager.prototype.reset = function() {
  var self = this;
  self.objects.length = 0;
  testData.forEach(function(_object) {
    self.objects.push(_.clone(_object));
  });
}

ObjectManager.prototype.unsubscribe = function() {
  this.mediator.remove(this.topic.list, this.subscription.list.id);
  this.mediator.remove(this.topic.load, this.subscription.load.id);
  this.mediator.remove(this.topic.save, this.subscription.save.id);
  this.mediator.remove(this.topic.create, this.subscription.create.id);
  this.mediator.remove(this.topic.delete, this.subscription.delete.id);
}

module.exports = ObjectManager;
