'use strict';

var sync = require('../sync-client')

function wrapper(mediator) {
  var manager;
  mediator.subscribe('sync:init', function($fh, syncOptions) {
    try {
      sync.init($fh, syncOptions)
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
    mediator.subscribe('sync:'+datasetId+':save', function(data) {  // TODO: rename this event to 'update'
      manager.update(data).then(function(syncResult) {
        mediator.publish('done:sync:'+datasetId+':save:' + syncResult.uid, syncResult); // TODO: unwrap the sync result, extracting the object
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
    mediator.subscribe('sync:'+datasetId+':new', function(data) {  // TODO: make this generic, or get rid of it
      $timeout(function() {
        var object = {
          type: 'Job Order'
        , status: 'New'
        };
        mediator.publish('done:sync:'+datasetId+':new', object);
      })
    });
  }
}
;

module.exports = wrapper;
