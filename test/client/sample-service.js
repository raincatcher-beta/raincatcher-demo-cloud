'use strict';

module.exports = 'sync-service.consumer';

angular.module('sync-service.consumer', [require('../../lib/angular/sync-ng.js')])
.factory('object1Sync', function(syncService) {
  syncService.init(window.$fh, {do_console_log: false});
  var object1Sync = {};
  object1Sync.managerPromise = syncService.manage('sample-dataset-id-1')
  .then(function(_manager) {
    object1Sync.manager = _manager;
  });

  return object1Sync;
})
.factory('object2Sync', function(syncService) {
  syncService.init(window.$fh, {do_console_log: false});
  var object2Sync = {};
  object2Sync.managerPromise = syncService.manage('sample-dataset-id-2')
  .then(function(_manager) {
    object2Sync.manager = _manager;
  });

  return object2Sync;
});
