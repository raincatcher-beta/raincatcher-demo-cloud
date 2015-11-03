'use strict'

debugger;
var $fh = require('../lib/feedhenry')
  , should = require('should')
  , config = require('../test-config')
  , mediator = require('fh-wfm-mediator/mediator')
  , sync = require('../../lib/sync-client')
  , q = require('q')
  ;

// alternative to loading fhconfig via xhr
window.fh_app_props = require('../lib/fhconfig.json');

describe('Test the sync framework', function() {
  var oldNavigator;

  before(function() {
    localStorage.clear();

    // Overide window.navigator.onLine to make sync work
    var fakeNavigator = {};
    for (var i in navigator) {
      fakeNavigator[i] = navigator[i];
    }
    fakeNavigator.onLine = true;
    oldNavigator = navigator;
    navigator = fakeNavigator;

    sync.init($fh, mediator, config.syncOptions);
  });

  after(function() {
    navigator = oldNavigator;
  });

  describe('Single dataset', function() {
    var manager, topic, subscription;

    before(function(done) {
      topic = 'sync:notification:'+config.datasetId;
      subscription = mediator.subscribe(topic, function(event) {
        console.log('\x1b[36m%s\x1b[0m', '** sync event:', event.dataset_id, ':', event.code, ':',  event.message);
      });
      console.log('listening for events on topic:', topic);
      var deferred = q.defer();
      sync.manage(config.datasetId).then(function(_manager) {
        manager = _manager;
        var sub = mediator.subscribe('sync:notification:'+config.datasetId, function(notification) {
          if (notification.code === 'sync_complete') {
            mediator.remove('sync:notification:'+config.datasetId, sub.id);
            done();
          } else if (notification.code === 'sync_failed') {
            throw new Error('Sync Failed', notification);
          }
        });
      });
    });

    after(function() {
      mediator.remove(topic, subscription.id);
    });

    it('nothing blows up', function() {
      'true'.should.be.equal('true');
    });

    it('list result is correct', function() {
      return manager.list()
      .then(function(result) {
        result.should.have.length(5);
      })
    });

    it('create works', function() {
      this.timeout(15000);
      return manager.create({id:10, value:'test'})
      .then(function(created) {
        created.value.should.equal('test')
        return manager.read(created.id);
      })
      .then(function(result) {
        result.value.should.equal('test');
        return manager.list();
      })
      .then(function(result) {
        result.should.have.length(6);
      });
    });

    it('update works', function() {
      return manager.read(1262134)
      .then(function(result) {
        result.value = 'test2';
        return manager.update(result)
      })
      .then(function(updatedResult) {
        updatedResult.value.should.equal('test2');
        return manager.read(1262134);
      })
      .then(function(result) {
        result.value.should.equal('test2');
      });
    });
  });
});
