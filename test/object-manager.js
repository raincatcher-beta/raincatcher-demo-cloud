'use strict';

var _ = require('lodash')
  , config = require('./test-config')
  ;

var _objects = [
  { id: 1276001, workflowId: '0', type: 'Job Order', title: 'Footpath in disrepair', status: 'In Progress', finishTimestamp: '2015-10-22T07:00:00Z', address: '118 N Peoria @N Chicago, IL 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276231, workflowId: '1', type: 'Job Order', title: 'Road in disrepair', status: 'Complete', finishTimestamp: '2015-10-22T07:00:00Z', address: '2116 Sussex Dr. @Redmond, WA 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276712, workflowId: '2', type: 'Job Order', title: 'Driveway in disrepair', status: 'Aborted', finishTimestamp: '2015-10-22T07:00:00Z', address: '18 Curve Cr. @San Jose, CA 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1262134, workflowId: '2', type: 'Job Order', title: 'Door in disrepair', status: 'On Hold', finishTimestamp: '2015-10-22T07:00:00Z', address: '623 Ferry St. @Boise, ID 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 12623122, workflowId: '2', type: 'Job Order', title: 'Roof in disrepair', status: 'Unassigned', finishTimestamp: '2015-10-22T07:00:00Z', address: '5528 Closed loop @Boston, MA 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 12623125, workflowId: '2', type: 'Job Order', title: 'House in disrepair', status: 'New', finishTimestamp: '2015-10-22T07:00:00Z', address: '364 Driver way @Portland, OR 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'}
];

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
  this.subscription.list = mediator.subscribe(self.topic.list, function() {
    console.log(self.topic.list, 'called');
    setTimeout(function() {
      mediator.publish('done:' + self.topic.list, self.objects);
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
}

ObjectManager.prototype.reset = function() {
  var self = this;
  self.objects.length = 0;
  _objects.forEach(function(_object) {
    self.objects.push(_.clone(_object));
  });
}

ObjectManager.prototype.unsubscribe = function() {
  this.mediator.remove(this.topic.list, this.subscription.list.id);
  this.mediator.remove(this.topic.load, this.subscription.load.id);
  this.mediator.remove(this.topic.save, this.subscription.save.id);
  this.mediator.remove(this.topic.create, this.subscription.create.id);
}

module.exports = ObjectManager;
