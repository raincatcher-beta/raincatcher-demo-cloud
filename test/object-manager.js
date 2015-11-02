'use strict';

var _ = require('lodash')
  , config = require('./test-config')
  ;

var objects = [
  { id: 1276001, workflowId: '0', type: 'Job Order', title: 'Footpath in disrepair', status: 'In Progress', finishTimestamp: '2015-10-22T07:00:00Z', address: '118 N Peoria @N Chicago, IL 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276231, workflowId: '1', type: 'Job Order', title: 'Road in disrepair', status: 'Complete', finishTimestamp: '2015-10-22T07:00:00Z', address: '2116 Sussex Dr. @Redmond, WA 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276712, workflowId: '2', type: 'Job Order', title: 'Driveway in disrepair', status: 'Aborted', finishTimestamp: '2015-10-22T07:00:00Z', address: '18 Curve Cr. @San Jose, CA 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1262134, workflowId: '2', type: 'Job Order', title: 'Door in disrepair', status: 'On Hold', finishTimestamp: '2015-10-22T07:00:00Z', address: '623 Ferry St. @Boise, ID 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 12623122, workflowId: '2', type: 'Job Order', title: 'Roof in disrepair', status: 'Unassigned', finishTimestamp: '2015-10-22T07:00:00Z', address: '5528 Closed loop @Boston, MA 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 12623122, workflowId: '2', type: 'Job Order', title: 'House in disrepair', status: 'New', finishTimestamp: '2015-10-22T07:00:00Z', address: '364 Driver way @Portland, OR 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'}
];

module.exports = function(mediator) {
  var topicList = 'sync:'+config.datasetId+':list:load';
  console.log('Subscribing to topic:', topicList);
  mediator.subscribe(topicList, function() {
    console.log(topicList, 'called');
    setTimeout(function() {
      mediator.publish('done:'+topicList, objects);
    }, 0);
  });

  var topicLoad = 'sync:'+config.datasetId+':load';
  console.log('Subscribing to topic:', topicLoad);
  mediator.subscribe(topicLoad, function(id) {
    console.log(topicLoad, 'called');
    setTimeout(function() {
      var object = _.find(objects, function(_object) {
        return _object.id == id;
      });
      mediator.publish('done:' + topicLoad + ':' + id, object);
    }, 0);
  });

  var topicSave = 'sync:'+config.datasetId+':save';
  console.log('Subscribing to topic:', topicSave);
  mediator.subscribe(topicSave, function(object) {
    console.log(topicSave, 'called');
    setTimeout(function() {
      var index = _.findIndex(objects, function(_object) {
        return _object.id == object.id;
      });
      objects[index] = object;
      console.log('Saved object:', object);
      mediator.publish('done:' + topicSave + ':' + object.id, object);
    }, 0);
  });

  var topicCreate = 'sync:'+config.datasetId+':create';
  console.log('Subscribing to topic:', topicCreate);
  mediator.subscribe(topicCreate, function(object, timestamp) {
    console.log(topicCreate, 'called');
    setTimeout(function() {
      object.id = objects.length;
      objects.push(object);
      console.log('Created object:', object);
      mediator.publish('done:' + topicCreate + ':' + timestamp, object);
    }, 0);
  });
}
