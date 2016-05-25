/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var ArrayStore = require('fh-wfm-mediator/lib/array-store')

var groups = [
  {id: 0, name: 'Drivers', role: 'worker'},
  {id: 1, name: 'Back Office', role: 'manager'},
  {id: 2, name: 'Management', role: 'admin'}
];

var nextId = groups.length;

var membership = [
];

module.exports = function(mediator) {
  var groupStore = new ArrayStore('group', groups);
  groupStore.listen('cloud:', mediator);

  var membershipStore = new ArrayStore('membership', membership);
  membershipStore.listen('cloud:', mediator);
}
