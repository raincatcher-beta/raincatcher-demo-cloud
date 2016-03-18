/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var ArrayStore = require('fh-wfm-mediator/array-store')

var files = [];

module.exports = function(mediator) {
  var arrayStore = new ArrayStore('file', files);
  arrayStore.listen('wfm:', mediator);
}
