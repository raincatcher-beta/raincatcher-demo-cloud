'use strict';

var sync = require('../sync-client')

module.exports = 'wfm.sync.service';

angular.module('wfm.sync.service', [])

.factory('syncService', function($q) {
  var syncService = {};

  syncService.init = function($fh, datasetId, syncOptions) {
    sync.init($fh, datasetId, syncOptions);
  }

  syncService.start = function() {
    return $q.when(sync.start());
  };

  syncService.read = function(id) {
    return $q.when(sync.read(id));
  };

  syncService.list = function() {
    return $q.when(sync.list());
  };

  syncService.update = function(object) {
    return $q.when(sync.update(object));
  };

  syncService.create = function(object) {
    return $q.when(sync.create(object));
  };

  return syncService;
})
;
