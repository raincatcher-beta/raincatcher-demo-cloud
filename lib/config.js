'use strict';

var cc = require('config-chain');

/**
 * The sync frequency to be passed to fh-wfm-sync.
 * Sync frequency is set individually for the client and the server.
 * * On the client the setting is named `sync_frequency`.
 * * On the server the setting is named `syncFrequency`.
 * It is recommended that these settings share the same value.
 */
var SYNC_FREQUENCY = 5;

var autoconfig = function(overrides) {
  var config = cc(overrides).add({
    IP: process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    PORT: process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001,
    dataTopicPrefix: ':cloud:data',
    persistentStore: process.env.WFM_USE_MEMORY_STORE !== "true",
    syncOptions: {
      "syncFrequency": SYNC_FREQUENCY,
      "sync_frequency" : SYNC_FREQUENCY,
      "storage_strategy": "dom",
      "do_console_log": false
    },
    syncFields: {
      result: ['id', 'stepResults'],
      workorders: ['id', 'workflowId', 'assignee', 'type', 'title', 'status', 'address', 'summary'],
      workflows: ['id', 'title'],
      messages: ['id', 'receiverId', 'status', 'subject', 'content']
    }
  });
  return config;
};

module.exports = autoconfig();