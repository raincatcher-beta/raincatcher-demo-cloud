'use strict';
var store = require('../store-init.js');

var messages = [
  { id: "rJVKowiUe", receiverId: "HJ8QkzOSH", status: "unread", sender: {avatar:"https://s3.amazonaws.com/uifaces/faces/twitter/kolage/128.jpg", name:"Trever Smith" }, subject: 'Adress change w41', content: 'hallo hallo'}
];

module.exports = function(mediator) {
  store.init('messages', messages, mediator);
};
