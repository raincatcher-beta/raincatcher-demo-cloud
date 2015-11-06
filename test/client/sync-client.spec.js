'use strict'

debugger;
var $fh = require('../lib/feedhenry')
  , should = require('should')
  , config = require('../test-config')
  , mediator = require('fh-wfm-mediator/mediator')
  , sync = require('../../lib/sync-client')
  , q = require('q')
  , syncTestHelper = require('./test-helper')
  , testData = require('../test-data');
  ;

// alternative to loading fhconfig via xhr
window.fh_app_props = require('../lib/fhconfig.json');

describe('Test the sync framework', function() {
  var datasetId = 'sync-client-dataset';
  before(function() {
    localStorage.clear();
    syncTestHelper.overrideNavigator();

    return syncTestHelper.syncServerInit($fh, datasetId).then(function() {
      return sync.init($fh, mediator, config.syncOptions);
    })
  });

  after(function() {
    return syncTestHelper.syncServerStop($fh, datasetId).then(function() {
      syncTestHelper.restoreNavigator();
    });
  });

  describe('Single dataset', function() {
    var manager, topic, subscription;

    before(function() {
      syncTestHelper.startLoggingNotifications(mediator, datasetId);
      return sync.manage(datasetId).then(function(_manager) {
        manager = _manager;
        return syncTestHelper.waitForSyncComplete(mediator, datasetId);
      });
    });

    after(function() {
      syncTestHelper.stopLoggingNotifications(mediator, datasetId);
      return manager.stop();
    });

    it('nothing blows up', function() {
      'true'.should.be.equal('true');
    });

    it('list result is correct', function() {
      return manager.list()
      .then(function(result) {
        result.should.have.length(testData.length);
      })
    });

    it('create works', function() {
      // syncTestHelper.restoreNavigator();
      var remoteCreatePromise;
      return manager.create({value:'test-client'})
      .then(function(created) {
        should.exist(created);
        should.exist(created._localuid);
        should.not.exist(created.id);
        created.value.should.equal('test-client')

        remoteCreatePromise = mediator.promise('sync:notification:'+datasetId, {
          predicate: function(notification) {
            return notification.code === 'remote_update_applied'
              && notification.message.action === 'create'
              && notification.message.hash === created._localuid;
          }
        });  // grab this promise immediately so we don't miss it's resolution during the read

        return manager.read(created._localuid);
      })
      .then(function(created) {
        should.not.exist(created.id);
        created.value.should.equal('test-client');
        return remoteCreatePromise.then(function(notification) {
          return created;
        });
      })
      .then(function(created) {
        // wait briefly for the remote_update_applied to be applied locally
        return q.delay(10).then(function() {
          return manager.read(created._localuid);
        });
      })
      .then(function(created) {
        should.exist(created.id);
        created.value.should.equal('test-client');
        created.id.should.equal(testData.length);
        return manager.read(created.id);
      })
      .then(function(created) {
        created.value.should.equal('test-client');
        created.id.should.equal(testData.length);
        return manager.list();
      })
      .then(function(result) {
        result.should.have.length(testData.length + 1);
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

    it('delete works', function() {
      return manager.read(1262134)
      .then(function(result) {
        result.value = 'test2';
        return manager.delete(result)
      })
      .then(function(msg) {
        msg.should.equal('delete');
        return manager.list();
      })
      .then(function(result) {
        result.should.have.length(testData.length);
      });
    });
  });
  describe('Single dataset, single user', function() {
    var manager, topic, subscription;

    before(function() {
      syncTestHelper.startLoggingNotifications(mediator, datasetId);
      return sync.manage(datasetId, null, {user: 'cathy'}).then(function(_manager) {
        manager = _manager;
        return syncTestHelper.waitForSyncComplete(mediator, datasetId);
      });
    });

    after(function() {
      syncTestHelper.stopLoggingNotifications(mediator, datasetId);
      return manager.stop();
    });

    it('nothing blows up', function() {
      'true'.should.be.equal('true');
    });

    it('list result is correct', function() {
      var filtered = testData.filter(function(data) {return data.user === 'cathy'});
      return manager.list()
      .then(function(result) {
        result.should.have.length(filtered.length);
      })
    });
  });
});
