'use strict';

var _ = require('lodash');
var sync = require('./lib/sync-server')

module.exports = function(mediator, app, mbaasApi) {
  sync.init(mediator, mbaasApi);
};
