'use strict';

var sync = require('../../sync-client');
sync.init();

module.exports = 'wfm.workorder.sync';

angular.module('wfm.workorder.sync', ['wfm.core.mediator'])
.factory('workorderSync', function($q, mediator) {
  var workorderSync = {};

  workorderSync.read = function(id) {
    return $q.when(sync.read(id));
  };

  workorderSync.list = function() {
    return $q.when(sync.list());
  };

  workorderSync.update = function(workorder) {
    return $q.when(sync.update(workorder));
  };

  workorderSync.create = function(workorder) {
    return $q.when(sync.create(workorder));
  };

  return workorderSync;
})
;
