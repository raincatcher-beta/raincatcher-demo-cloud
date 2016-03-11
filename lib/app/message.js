'use strict';

var ArrayStore = require('./array-store');

var messages = [
  { id: 1276001, receiver: "156340", subject: 'Adress change w41', content: 'hallo hallo'}
];

module.exports = function(mediator) {
  var arrayStore = new ArrayStore('messages', messages);
  arrayStore.listen('sync:', mediator);
}
