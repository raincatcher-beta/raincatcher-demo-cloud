'use strict';

var sync = require('../client');

module.exports = 'wfm.sync.service';

angular.module('wfm.sync.service', [])

.factory('syncService', function($q, mediator) {
  var syncService = {};

  function ManagerWrapper(_manager) {
    this.manager = _manager;
    var self = this;

    var methodNames = ['create', 'read', 'update', 'delete', 'list', 'start', 'stop', 'safeStop', 'getQueueSize', 'forceSync', 'waitForSync'];
    methodNames.forEach(function(methodName) {
      self[methodName] = function() {
        return $q.when(self.manager[methodName].apply(self.manager, arguments));
      };
    });
  }

  syncService.init = function($fh, syncOptions) {
    $fh = $fh || {};
    syncOptions = syncOptions || {};

    //If the feedhenry API is passed, use this.
    //Otherwise default to the global window.$fh
    if ($fh.sync) {
      sync.init($fh, syncOptions, mediator);
    } else {
      sync.init(window.$fh, syncOptions, mediator);
    }
  };

  syncService.manage = function(datasetId, options, queryParams, metaData) {
    return $q.when(sync.manage(datasetId, options, queryParams, metaData))
    .then(function(_manager) {
      var manager = new ManagerWrapper(_manager);
      manager.stream = _manager.stream;
      return manager;
    });
  };

  return syncService;
});
