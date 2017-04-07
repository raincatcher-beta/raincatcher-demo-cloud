'use strict';

var store = require('../storage/storage-init');

module.exports = function(mediator) {
  store.init('result', null, mediator);
};
