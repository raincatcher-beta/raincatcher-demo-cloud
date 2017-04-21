'use strict';

var store = require('../storage/storage-init');

module.exports = function(mediator) {
  return store.init('result', null, mediator);
};
