'use strict';

var store = require('../store-init.js');

module.exports = function(mediator) {
  store.init('result', null, mediator);
};
