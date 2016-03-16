'use strict';

var ArrayStore = require('fh-wfm-mediator/array-store');

var messages = [
  { id: 1276001, receiverId: "156340", status: "unread", sender: {avatar:"https://s3.amazonaws.com/uifaces/faces/twitter/kolage/128.jpg", name:"Trever Smith" }, subject: 'Adress change w41', content: 'hallo hallo'}
];

module.exports = function(mediator) {
  var arrayStore = new ArrayStore('messages', messages);
  arrayStore.listen('sync:', mediator);
}
