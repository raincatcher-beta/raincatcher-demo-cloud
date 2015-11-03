'use strict';

var sync = require('../sync-client')

module.exports = 'wfm.sync.service';

angular.module('wfm.sync.service', [])

.factory('syncService', function($q) {
  var syncService = {};
  var managerPromise;

  syncService.init = function($fh, datasetId, syncOptions) {
    sync.init($fh, syncOptions);
  }

  syncService.manage = function(datasetId) {
    managerPromise = $q.when(sync.manage(datasetId))
    return managerPromise;
  };

  syncService.read = function(id) {
    return managerPromise.then(function(manager) {
      return $q.when(manager.read(id));
    });
  };

  syncService.list = function() {
    return managerPromise.then(function(manager) {
      return $q.when(manager.list());
    });
  };

  syncService.update = function(object) {
    return managerPromise.then(function(manager) {
      return $q.when(manager.update(object));
    });
  };

  syncService.create = function(object) {
    return managerPromise.then(function(manager) {
      return $q.when(sync.create(object));
    });
  };

  return syncService;
})
;
