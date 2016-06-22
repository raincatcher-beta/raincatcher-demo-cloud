'use strict';

var sync = require('../client')

module.exports = 'wfm.sync.service';

angular.module('wfm.sync.service', [])

.factory('syncService', function($q) {
  var syncService = {};
  var managerPromise;

  function ManagerWrapper(_manager) {
    this.manager = _manager;
    var self = this;

    var methodNames = ['create', 'read', 'update', 'delete', 'list', 'start', 'stop', 'safeStop', 'getQueueSize', 'forceSync', 'waitForSync'];
    methodNames.forEach(function(methodName) {
      self[methodName] = function() {
        return $q.when(self.manager[methodName].apply(self.manager, arguments));
      }
    });
  };

  syncService.init = function($fh, syncOptions) {
    sync.init($fh, syncOptions);
  }

  syncService.manage = function(datasetId, options, queryParams, metaData) {
    return $q.when(sync.manage(datasetId, options, queryParams, metaData))
    .then(function(_manager) {
      var manager = new ManagerWrapper(_manager);
      manager.stream = _manager.stream;
      return manager;
    });
  };

  return syncService;
})
;
