'use strict';

var sync = require('../sync-client')

function wrapper(mediator) {
  var manager;
  mediator.subscribe('sync:init', function($fh, syncOptions) {
    try {
      sync.init($fh, mediator, syncOptions)
    } catch(e) {
      mediator.publish('error:sync:init');
    }
    setTimeout(function() {
      mediator.publish('done:sync:init');
    }, 0);
  });

  mediator.subscribe('sync:manage', function(datasetId) {
    sync.manage(datasetId).then(function(_manager) {
      manager = _manager;
      setupListeners(datasetId);
      mediator.publish('done:sync:manage:'+datasetId, manager);
    }, function(error) {
      mediator.publish('error:sync:manage:'+datasetId, error);
    });
  });

  function setupListeners(datasetId) {
    mediator.subscribe('sync:'+datasetId+':load', function(data) {
      manager.read(data).then(function(object) {
        mediator.publish('done:sync:'+datasetId+':load:' + object.id, object);
      }, function(error) {
        console.error(error);
      })
    });
    mediator.subscribe('sync:'+datasetId+':list:load', function() {
      manager.list().then(function(objects) {
        mediator.publish('done:sync:'+datasetId+':list:load', objects);
      }, function(error) {
        console.error(error);
      })
    });
    mediator.subscribe('sync:'+datasetId+':update', function(data) {
      manager.update(data).then(function(syncResult) {
        mediator.publish('done:sync:'+datasetId+':update:' + syncResult.uid, syncResult);
      }, function(error) {
        console.error(error);
      })
    });
    mediator.subscribe('sync:'+datasetId+':create', function(data, ts) {
      manager.create(data).then(function(object) {
        mediator.publish('done:sync:'+datasetId+':create:' + ts, object);
      }, function(error) {
        console.error(error);
      })
    });
    mediator.subscribe('sync:'+datasetId+':stop', function() {
      manager.stop().then(function() {
        mediator.publish('done:sync:'+datasetId+':stop');
      }, function(error) {
        mediator.publish('error:sync:'+datasetId+':stop', error);
      });
    });
  }
}
;

module.exports = wrapper;
