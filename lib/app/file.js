'use strict';

var ArrayStore = require('fh-wfm-mediator/lib/array-store')

var files = [];

module.exports = function(mediator) {
  var arrayStore = new ArrayStore('file', files);
  arrayStore.listen('cloud:', mediator);
}
