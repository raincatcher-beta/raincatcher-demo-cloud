'use strict';

var cc = require('config-chain');

var autoconfig = function(overrides) {
  var config = cc(overrides).add({
    IP: process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    PORT: process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001,
    dataTopicPrefix: ':cloud:data',
    persistentStore: process.env.WFM_USE_MEMORY_STORE !== "true",
    syncOptions: {
      "sync_frequency" : 5,
      "storage_strategy": "dom",
      "do_console_log": false
    }
  });
  return config;
};

module.exports = autoconfig();