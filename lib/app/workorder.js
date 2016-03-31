/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var ArrayStore = require('fh-wfm-mediator/lib/array-store')

var workorders = [
  { id: 1276001, workflowId: '1339', assignee: '156340', type: 'Job Order', title: 'Footpath in disrepair', status: 'New', startTimestamp: '2015-10-22T14:00:00Z', address: '1795 Davie St, Vancouver, BC V6G 2M9', location: [49.287227, -123.141489], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276002, workflowId: '1339', assignee: '156340', type: 'Job Order', title: 'Chimney in disrepair', status: 'New', startTimestamp: '2015-10-22T20:00:00Z', address: '1641 Davie St, Vancouver, BC V6G 1W1', location: [49.285547, -123.138915], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276003, workflowId: '1339', assignee: '156340', type: 'Job Order', title: 'Wall in disrepair', status: 'New', startTimestamp: '2015-10-22T07:00:00Z', address: '1095 W Pender St, Vancouver, BC V6E', location: [49.287339, -123.120203], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276004, workflowId: '1339', assignee: '156340', type: 'Job Order', title: 'House in disrepair', status: 'New', startTimestamp: '2015-10-22T07:00:00Z', address: '1088 Burrard St, Vancouver, BC V6Z 2R9', location: [49.280396, -123.125868], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276231, workflowId: '1338', assignee: '156340', type: 'Job Order', title: 'Road in disrepair', status: 'New', startTimestamp: '2015-10-22T07:00:00Z', address: '977 Mainland St #987, Vancouver, BC V6B 1T2', location: [49.277026, -123.118487], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276712, workflowId: '1339', assignee: '156340', type: 'Job Order', title: 'Driveway in disrepair', status: 'New', startTimestamp: '2015-10-22T07:00:00Z', address: '157 st, 163 Keefer St, Vancouver, BC V6A 1X4', location: [49.279490, -123.099947], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1262134, workflowId: '1339', assignee: '156340', type: 'Job Order', title: 'Door in disrepair', status: 'New', startTimestamp: '2015-10-22T07:00:00Z', address: '2795 East Hastings St, Vancouver, BC V5K 1Z8', location: [49.281159, -123.047076], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1362312, workflowId: '1337', assignee: '156340', type: 'Job Order', title: 'Roof in disrepair', status: 'New', startTimestamp: '2015-10-22T07:00:00Z', address: '2930 Virtual Way, Vancouver, BC V5M 0A5', location: [49.259429, -123.044158], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276005, workflowId: '1339', assignee: '373479', type: 'Job Order', title: 'Yard in disrepair', status: 'New', startTimestamp: '2015-10-22T15:00:00Z', address: '1780 E Broadway, Vancouver, BC V5N 1W3', location: [49.261782, -123.068705], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276006, workflowId: '1339', assignee: '373479', type: 'Job Order', title: 'Sprinkler in disrepair', status: 'New', startTimestamp: '2015-10-22T07:00:00Z', address: '311 E Broadway, Vancouver, BC V5T 1W5', location: [49.262902, -123.098917], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1362312, workflowId: '1339', assignee: '373479', type: 'Job Order', title: 'House in disrepair', status: 'New', startTimestamp: '2015-10-22T07:00:00Z', address: '2035 Yukon St, Vancouver, BC V5Y 3W3', location: [49.267271, -123.112822], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276233, workflowId: '1339', assignee: '235843', type: 'Job Order', title: 'Tub in disrepair', status: 'New', startTimestamp: '2015-10-22T14:00:00Z', address: '555 W 12th Ave, Vancouver, BC V5Z 3X7', location: [49.260662, -123.116599], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276234, workflowId: '1339', assignee: '754282', type: 'Job Order', title: 'Window in disrepair', status: 'New', startTimestamp: '2015-10-22T07:00:00Z', address: '1502 E Hastings St, Vancouver, BC V5L 1S5', location: [49.281159, -123.073855], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276235, workflowId: '1337', assignee: '994878', type: 'Job Order', title: 'Carpet in disrepair', status: 'New', startTimestamp: '2015-10-22T20:00:00Z', address: '860 Drake St, Vancouver, BC V6Z 2P2', location: [49.276903, -123.129645], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276232, workflowId: '1339', assignee: null, type: 'Job Order', title: 'Sink in disrepair', status: 'New', startTimestamp: '2015-10-22T07:00:00Z', address: '3820 Oak St, Vancouver, BC V6H 2M5', location: [49.251362, -123.127070], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'}
];

module.exports = function(mediator) {
  // Rebase the workorder dates to today
  var today = new Date();
  var tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  workorders.forEach(function(workorder, index) {
    var date = new Date(workorder.startTimestamp);
    var hours = date.getHours();
    var newDate = index < workorders.length *2 / 3 ? today : tomorrow;
    newDate.setHours(hours);
    workorder.startTimestamp = newDate.getTime();
  })
  var arrayStore = new ArrayStore('workorders', workorders);
  arrayStore.listen('cloud:', mediator);
}
