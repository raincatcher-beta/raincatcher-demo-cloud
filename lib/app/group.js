/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var ArrayStore = require('fh-wfm-mediator/lib/array-store')

var groups = [
  {id: "Syl1GdSS", name: 'Drivers', role: 'worker'},
  {id: "SyglkfurH", name: 'Back Office', role: 'manager'},
  {id: "rkX1fdSH", name: 'Management', role: 'admin'}
];

var nextId = groups.length;

var membership = [
  {id: "rkX1fdSH", group: "Syl1GdSS", user: "rkX1fdSH"},
  {id: "rJeXyfdrH", group: "Syl1GdSS", user: "rJeXyfdrH"},
  {id: "ByzQyz_BS", group: "Syl1GdSS", user: "H1ZmkzOrr"},
  {id: "BJQm1G_BS", group: "Syl1GdSS", user: "ByzQyz_BS"},
  {id: "SyVXyMuSr", group: "Syl1GdSS", user: "BJQm1G_BS"},
  {id: "B1r71fOBr", group: "SyglkfurH", user: "SyVXyMuSr"},
  {id: "HJ8QkzOSH", group: "SyglkfurH", user: "B1r71fOBr"},
  {id: "BJwQJfdrH", group: "rkX1fdSH", user: "HJ8QkzOSH"}
];

module.exports = function(mediator) {
  var groupStore = new ArrayStore('group', groups);
  groupStore.listen('cloud:', mediator);

  var membershipStore = new ArrayStore('membership', membership);
  membershipStore.listen('cloud:', mediator);
}
