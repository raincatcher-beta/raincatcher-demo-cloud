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

  /**
   *
   * Initialising the sync module with any required options.
   *
   * @param {object} _$fh          - (Optional) A reference to the feedhenry client API
   * @param {object} _syncOptions  - (Optional) Any options required for intialising the $fh.sync API.
   */
  syncService.init = function(_$fh, _syncOptions) {
    var fhApi = (_$fh && _syncOptions) ? _$fh : window.$fh;
    var syncOptions = (_$fh && _syncOptions) ? _syncOptions : _$fh;
    syncOptions = syncOptions || {};


    //If the feedhenry API is passed, initialise the sync module
    if (fhApi && fhApi.sync) {
      sync.init(fhApi, syncOptions, mediator);
    }
  };

  /**
   *
   * Creating a manager for a single data set.
   *
   * @param {string} datasetId - The identifier for the dataset to manage
   * @param {object} options   - Any sync options required for this data set. See $fh.sync Client API docs for more information.
   * @param {object} queryParams - Parameters to pass when listing dataset items
   * @param {object} metaData    - Metadata to pass to the server for synchronisation calls
   * @returns {Promise<TResult>}
   */
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
