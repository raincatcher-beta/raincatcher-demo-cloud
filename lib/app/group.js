'use strict';

var store = require('../storage/storage-init');

var groups = [
  {id: "Syl1GdSS", name: 'Drivers', role: 'worker'},
  {id: "SyglkfurH", name: 'Back Office', role: 'manager'},
  {id: "rkX1fdSH", name: 'Management', role: 'admin'}
];

var membership = [
  {id: "rkX1fdSH", group: "Syl1GdSS", user: "rkX1fdSH"},
  {id: "rJeXyfdrH", group: "Syl1GdSS", user: "rJeXyfdrH"},
  {id: "ByzQyz_BS", group: "Syl1GdSS", user: "H1ZmkzOrr"},
  {id: "BJQm1G_BS", group: "Syl1GdSS", user: "ByzQyz_BS"},
  {id: "SyVXyMuSr", group: "Syl1GdSS", user: "BJQm1G_BS"},
  {id: "B1r71fOBr", group: "SyglkfurH", user: "SyVXyMuSr"},
  {id: "HJ8QkzOSH", group: "SyglkfurH", user: "B1r71fOBr"},
  {id: "BJwQJfdrH", group: "rkX1fdSH", user: "HJ8QkzOSH"}
];

module.exports = function(mediator) {
  store.init('group', groups, mediator);
  store.init('membership', membership, mediator);
};
