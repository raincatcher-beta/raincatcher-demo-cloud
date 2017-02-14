'use strict';

var cc = require('config-chain');

function autoconfig(overrides) {
  var config = cc(overrides).add({
    IP: process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    PORT: process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001,
    dataTopicPrefix: ':cloud:data',
    persistentStore: process.env.WFM_USE_MEMORY_STORE !== "true",
    syncOptions: {
      "sync_frequency" : 5,
      "storage_strategy": "dom",
      "do_console_log": false
    },
    metrics: {
      enabled: process.env.METRICS_ENABLED || 'false',
      host: process.env.METRICS_HOST || '127.0.0.1',
      port: process.env.METRICS_PORT || '8813',
      title: 'cloud-app-' + process.env.FH_TITLE,
      cpu_interval: process.env.METRICS_CPU_INTERVAL |0 || 2000,
      mem_interval: process.env.METRICS_MEM_INTERVAL |0 || 1000
    }
  });
  return config;
}

exports = module.exports = autoconfig();
