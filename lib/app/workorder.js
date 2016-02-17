/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var ArrayStore = require('./array-store')

var workorders = [
  { id: 1276001, workflowId: '2', assignee: '156340', type: 'Job Order', title: 'Footpath in disrepair', status: 'In Progress', finishTimestamp: '2015-10-22T07:00:00Z', address: '118 N Peoria @N Chicago, IL 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276002, workflowId: '2', assignee: '156340', type: 'Job Order', title: 'Chimney in disrepair', status: 'In Progress', finishTimestamp: '2015-10-22T07:00:00Z', address: '118 N Peoria @N Chicago, IL 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276003, workflowId: '2', assignee: '156340', type: 'Job Order', title: 'Wall in disrepair', status: 'In Progress', finishTimestamp: '2015-10-22T07:00:00Z', address: '118 N Peoria @N Chicago, IL 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276004, workflowId: '2', assignee: '156340', type: 'Job Order', title: 'House in disrepair', status: 'In Progress', finishTimestamp: '2015-10-22T07:00:00Z', address: '118 N Peoria @N Chicago, IL 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276231, workflowId: '1', assignee: '156340', type: 'Job Order', title: 'Road in disrepair', status: 'Complete', finishTimestamp: '2015-10-22T07:00:00Z', address: '2116 Sussex Dr. @Redmond, WA 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276712, workflowId: '2', assignee: '156340', type: 'Job Order', title: 'Driveway in disrepair', status: 'Aborted', finishTimestamp: '2015-10-22T07:00:00Z', address: '18 Curve Cr. @San Jose, CA 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1262134, workflowId: '2', assignee: '156340', type: 'Job Order', title: 'Door in disrepair', status: 'On Hold', finishTimestamp: '2015-10-22T07:00:00Z', address: '623 Ferry St. @Boise, ID 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1362312, workflowId: '0', assignee: '156340', type: 'Job Order', title: 'Roof in disrepair', status: 'Unassigned', finishTimestamp: '2015-10-22T07:00:00Z', address: '5528 Closed loop @Boston, MA 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276005, workflowId: '2', assignee: '373479', type: 'Job Order', title: 'Yard in disrepair', status: 'In Progress', finishTimestamp: '2015-10-22T07:00:00Z', address: '118 N Peoria @N Chicago, IL 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276006, workflowId: '2', assignee: '373479', type: 'Job Order', title: 'Sprinkler in disrepair', status: 'In Progress', finishTimestamp: '2015-10-22T07:00:00Z', address: '118 N Peoria @N Chicago, IL 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1362312, workflowId: '2', assignee: '373479', type: 'Job Order', title: 'House in disrepair', status: 'New', finishTimestamp: '2015-10-22T07:00:00Z', address: '364 Driver way @Portland, OR 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276233, workflowId: '2', assignee: '235843', type: 'Job Order', title: 'Tub in disrepair', status: 'Complete', finishTimestamp: '2015-10-22T07:00:00Z', address: '2116 Sussex Dr. @Redmond, WA 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276234, workflowId: '2', assignee: '754282', type: 'Job Order', title: 'Window in disrepair', status: 'Complete', finishTimestamp: '2015-10-22T07:00:00Z', address: '2116 Sussex Dr. @Redmond, WA 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276235, workflowId: '0', assignee: '994878', type: 'Job Order', title: 'Carpet in disrepair', status: 'Complete', finishTimestamp: '2015-10-22T07:00:00Z', address: '2116 Sussex Dr. @Redmond, WA 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276232, workflowId: '2', assignee: null, type: 'Job Order', title: 'Sink in disrepair', status: 'Complete', finishTimestamp: '2015-10-22T07:00:00Z', address: '2116 Sussex Dr. @Redmond, WA 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'}
];

module.exports = function(mediator) {
  var arrayStore = new ArrayStore('workorders', workorders);
  arrayStore.listen(mediator);
}
