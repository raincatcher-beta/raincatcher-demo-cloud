/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var ArrayStore = require('./array-store')

var results = [];

module.exports = function(mediator) {
  var arrayStore = new ArrayStore('result', results);
  arrayStore.listen('sync:', mediator);
}
