'use strict';

var ArrayStore = require('./array-store');

var messages = [
  { id: 1276001, subject: 'Adress change w41', content: 'hallo hallo'}
];

module.exports = function(mediator) {
  var arrayStore = new ArrayStore('messages', messages);
  arrayStore.listen(mediator);
}