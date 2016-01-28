'use strict';

var ArrayStore = require('./array-store')

var results = [];

module.exports = function(mediator) {
  var arrayStore = new ArrayStore('result', results);
  arrayStore.listen(mediator);
}
