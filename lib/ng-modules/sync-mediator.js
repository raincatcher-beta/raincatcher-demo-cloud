'use strict';

module.exports = 'wfm.sync';

angular.module('wfm.sync', [
  'wfm.core.mediator'
, require('./sync-service')
])
.run(function($timeout, mediator, syncService) {
  var datasetId;
  mediator.subscribe('sync:'+datasetId+':init', function($fh, _datasetId, syncOptions) {
    try {
      datasetId = _datasetId;
      syncService.init($fh, datasetId, syncOptions)
    } catch(e) {
      mediator.publish('error:sync:'+datasetId+':init');
    }
    $timeout(function() {
      mediator.publish('done:sync:'+datasetId+':init');
    }, 0);
  });
  mediator.subscribe('sync:'+datasetId+':start', function() {
    syncService.start().then(function() {
      mediator.publish('done:sync:'+datasetId+':start');
    }, function(error) {
      mediator.publish('error:sync:'+datasetId+':start');
    });
  });
  mediator.subscribe('sync:'+datasetId+':load', function(data) {
    syncService.read(data).then(function(object) {
      mediator.publish('done:sync:'+datasetId+':load:' + object.id, object);
    }, function(error) {
      console.error(error);
    })
  });
  mediator.subscribe('sync:'+datasetId+':list:load', function() {
    syncService.list().then(function(objects) {
      mediator.publish('done:sync:'+datasetId+':list:load', objects);
    }, function(error) {
      console.error(error);
    })
  });
  mediator.subscribe('sync:'+datasetId+':save', function(data) {
    syncService.update(data).then(function(syncResult) {
      mediator.publish('done:sync:'+datasetId+':save:' + syncResult.uid, syncResult); // TODO: unwrap the sync result, extracting the object
    }, function(error) {
      console.error(error);
    })
  });
  mediator.subscribe('sync:'+datasetId+':create', function(data) {
    syncService.create(data).then(function(object) {
      mediator.publish('done:sync:'+datasetId+':create', object);
    }, function(error) {
      console.error(error);
    })
  });
  mediator.subscribe('sync:'+datasetId+':new', function(data) {
    $timeout(function() {
      var object = {
        type: 'Job Order'
      , status: 'New'
      };
      mediator.publish('done:sync:'+datasetId+':new', object);
    })
  });
})
;
