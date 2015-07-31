'use strict';

var cc = require('config-chain')

var autoconfig = function (overrides) {
  var config = cc(overrides).add({
    IP: process.env.IP || '0.0.0.0'
  , PORT: process.env.PORT || 8080
  });
  return config;
};

exports = module.exports = autoconfig();
