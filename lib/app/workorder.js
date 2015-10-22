'use strict';

var _ = require('lodash');

var workorders = [
  { id: 1276001, workflowId: '0', type: 'Job Order', title: 'Footpath in disrepair', status: 'In Progress', finishTimestamp: '2015-10-22T07:00:00Z', address: '118 N Peoria @N Chicago, IL 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276231, workflowId: '1', type: 'Job Order', title: 'Road in disrepair', status: 'Complete', finishTimestamp: '2015-10-22T07:00:00Z', address: '2116 Sussex Dr. @Redmond, WA 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276712, workflowId: '2', type: 'Job Order', title: 'Driveway in disrepair', status: 'Aborted', finishTimestamp: '2015-10-22T07:00:00Z', address: '18 Curve Cr. @San Jose, CA 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1262134, workflowId: '2', type: 'Job Order', title: 'Door in disrepair', status: 'On Hold', finishTimestamp: '2015-10-22T07:00:00Z', address: '623 Ferry St. @Boise, ID 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 12623122, workflowId: '2', type: 'Job Order', title: 'Roof in disrepair', status: 'Unassigned', finishTimestamp: '2015-10-22T07:00:00Z', address: '5528 Closed loop @Boston, MA 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 12623122, workflowId: '2', type: 'Job Order', title: 'House in disrepair', status: 'New', finishTimestamp: '2015-10-22T07:00:00Z', address: '364 Driver way @Portland, OR 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'}
];

module.exports = function(mediator) {
  console.log('Subscribing to mediator topic: workorders:load');
  mediator.subscribe('workorders:load', function() {
    setTimeout(function() {
      mediator.publish('workorders:loaded', workorders);
    }, 0);
  });

  mediator.subscribe('workorder:load', function(id) {
    setTimeout(function() {
      var workorder = _.find(workorders, function(_workorder) {
        return _workorder.id == id;
      });
      mediator.publish('workorder:loaded:' + id, workorder);
    }, 0);
  });

  mediator.subscribe('workorder:save', function(workorder) {
    setTimeout(function() {
      var index = _.findIndex(workorders, function(_workorder) {
        return _workorder.id == workorder.id;
      });
      workorders[index] = workorder;
      console.log('Saved workorder:', workorder);
      mediator.publish('workorder:saved:' + workorder.id, workorder);
    }, 0);
  });

  mediator.subscribe('workorder:create', function(workorder) {
    setTimeout(function() {
      workorder.id = workorders.length;
      workorders.push(workorder);
      console.log('Created workorder:', workorder);
      mediator.publish('workorder:created:' + workorder.createdTs, workorder);
    }, 0);
  });
}
