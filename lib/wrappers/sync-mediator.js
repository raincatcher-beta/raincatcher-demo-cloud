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

  mediator.subscribe('sync:manage', function(datasetId, options, queryParams, metaData) {
    sync.manage(datasetId, options, queryParams, metaData).then(function(_manager) {
      manager = _manager;
      setupListeners(datasetId);
      mediator.publish('done:sync:manage:'+datasetId, manager);
    }, function(error) {
      mediator.publish('error:sync:manage:'+datasetId, error);
    });
  });

  function setupListeners(datasetId) {
    mediator.subscribe('sync:'+datasetId+':read', function(data) {
      manager.read(data).then(function(object) {
        mediator.publish('done:sync:'+datasetId+':read:' + object.id, object);
      }, function(error) {
        console.error(error);
      })
    });
    mediator.subscribe('sync:'+datasetId+':list', function() {
      manager.list().then(function(objects) {
        mediator.publish('done:sync:'+datasetId+':list', objects);
      }, function(error) {
        console.error(error);
      })
    });
    mediator.subscribe('sync:'+datasetId+':update', function(data) {
      manager.update(data).then(function(updated) {
        mediator.publish('done:sync:'+datasetId+':update:' + updated.id, updated);
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
    mediator.subscribe('sync:'+datasetId+':delete', function(data) {
      manager.delete(data).then(function(deleted) {
        mediator.publish('done:sync:'+datasetId+':delete:' + data.id, deleted);
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
