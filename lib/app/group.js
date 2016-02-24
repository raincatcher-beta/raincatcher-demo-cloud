/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var ArrayStore = require('./array-store')

var groups = [
  {id: 0, name: 'Drivers', role: 'worker'},
  {id: 1, name: 'Back Office', role: 'manager'},
  {id: 2, name: 'Management', role: 'admin'}
];

var nextId = groups.length;

var membership = [
  {group: 0, user: 156340},
  {group: 0, user: 373479},
  {group: 0, user: 235843},
  {group: 0, user: 754282},
  {group: 0, user: 994878},
  {group: 1, user: 546834},
  {group: 1, user: 865435},
  {group: 2, user: 122334}
];

module.exports = function(mediator) {
  var groupStore = new ArrayStore('group', groups);
  groupStore.listen('rest:', mediator);

  var membershipStore = new ArrayStore('membership', membership);
  membershipStore.listen('rest:', mediator);
}
