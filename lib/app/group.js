/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var ArrayStore = require('fh-wfm-mediator/lib/array-store')

var groups = [
  {id: 1010, name: 'Drivers', role: 'worker'},
  {id: 1020, name: 'Back Office', role: 'manager'},
  {id: 1030, name: 'Management', role: 'admin'}
];

var nextId = groups.length;

var membership = [
  {id: 0, group: 1010, user: 156340},
  {id: 1, group: 1010, user: 373479},
  {id: 2, group: 1010, user: 235843},
  {id: 3, group: 1010, user: 754282},
  {id: 4, group: 1010, user: 994878},
  {id: 5, group: 1020, user: 546834},
  {id: 6, group: 1020, user: 865435},
  {id: 7, group: 1030, user: 122334}
];

module.exports = function(mediator) {
  var groupStore = new ArrayStore('group', groups);
  groupStore.listen('cloud:', mediator);

  var membershipStore = new ArrayStore('membership', membership);
  membershipStore.listen('cloud:', mediator);
}
