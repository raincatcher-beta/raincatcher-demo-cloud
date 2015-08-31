'use strict';

var _ = require('lodash');

var workorders = [
  { id: 1276001, type: 'Job Order', title: 'Footpath in disrepair', status: 'In Progress', address: '118 N Peoria @N Chicago, IL 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276231, type: 'Job Order', title: 'Road in disrepair', status: 'Complete', address: '2116 Sussex Dr. @Redmond, WA 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276712, type: 'Job Order', title: 'Driveway in disrepair', status: 'Aborted', address: '18 Curve Cr. @San Jose, CA 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1262134, type: 'Job Order', title: 'Door in disrepair', status: 'On Hold', address: '623 Ferry St. @Boise, ID 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 12623122, type: 'Job Order', title: 'Roof in disrepair', status: 'Unassigned', address: '5528 Closed loop @Boston, MA 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 12623122, type: 'Job Order', title: 'House in disrepair', status: 'New', address: '364 Driver way @Portland, OR 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'}
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
      mediator.publish('workorder:loaded', workorder);
    }, 0);
  });
}
