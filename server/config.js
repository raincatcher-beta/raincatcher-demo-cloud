'use strict';

var cc = require('config-chain')

var autoconfig = function (overrides) {
  var config = cc(overrides).add({
    IP: process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'
  , PORT: process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001
  });
  return config;
};

exports = module.exports = autoconfig();
