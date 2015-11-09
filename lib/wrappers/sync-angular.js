'use strict';

var sync = require('../sync-client')

module.exports = 'wfm.sync.service';

angular.module('wfm.sync.service', [])

.factory('syncService', function($q) {
  var syncService = {};
  var managerPromise;

  syncService.init = function($fh, syncOptions) {
    sync.init($fh, syncOptions);
  }

  syncService.manage = function(datasetId, options, queryParams, metaData) {
    managerPromise = $q.when(sync.manage(datasetId, options, queryParams, metaData));
    return managerPromise;
  };

  syncService.create = function(object) {
    return managerPromise.then(function(manager) {
      return $q.when(sync.create(object));
    });
  };

  syncService.read = function(id) {
    return managerPromise.then(function(manager) {
      return $q.when(manager.read(id));
    });
  };

  syncService.update = function(object) {
    return managerPromise.then(function(manager) {
      return $q.when(manager.update(object));
    });
  };

  syncService.delete = function(object) {
    return managerPromise.then(function(manager) {
      return $q.when(manager.delete(object));
    });
  };

  syncService.list = function() {
    return managerPromise.then(function(manager) {
      return $q.when(manager.list());
    });
  };

  syncService.start = function() {
    return managerPromise.then(function(manager) {
      return $q.when(manager.start());
    });
  };

  syncService.stop = function() {
    return managerPromise.then(function(manager) {
      return $q.when(manager.stop());
    });
  };

  syncService.forceSync = function() {
    return managerPromise.then(function(manager) {
      return $q.when(manager.forceSync());
    });
  };

  return syncService;
})
;
