'use strict'

debugger;
var $fh = require('../lib/feedhenry')
  , should = require('should')
  , config = require('../test-config')
  , mediator = require('fh-wfm-mediator/mediator')
  , sync = require('../../lib/sync-client')
  , q = require('q')
  , helper = require('./test-helper')
  , testData = require('../test-data');
  ;

// alternative to loading fhconfig via xhr
window.fh_app_props = require('../lib/fhconfig.json');

describe('Test the sync framework', function() {
  var datasetId = 'sync-client-dataset';
  before(function() {
    localStorage.clear();
    helper.overrideNavigator();

    return helper.syncServerInit($fh, datasetId).then(function() {
      return sync.init($fh, mediator, config.syncOptions);
    })
  });

  after(function() {
    return helper.syncServerStop($fh, datasetId).then(function() {
      helper.restoreNavigator();
    });
  });

  describe('Single dataset', function() {
    var manager, topic, subscription;

    before(function() {
      helper.startLoggingNotifications(mediator, datasetId);
      return sync.manage(datasetId).then(function(_manager) {
        manager = _manager;
        return helper.waitForSyncComplete(mediator, datasetId);
      });
    });

    after(function() {
      helper.stopLoggingNotifications(mediator, datasetId);
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
      // helper.restoreNavigator();
      var remoteCreatePromise;
      return manager.create({value:'test-client'})
      .then(function(created) {
        should.exist(created);
        should.exist(created._localuid);
        should.not.exist(created.id);
        created.value.should.equal('test-client')
        remoteCreatePromise = helper.notificationPromise(mediator, datasetId, {
          code:'remote_update_applied',
          message: {
            action:'create',
            hash: created._localuid
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

    it('checkStatus works', function() {
      return manager.forceSync()
      .then(function() {
        return helper.notificationPromise(mediator, datasetId, {code:'sync_complete', message:'online'});
      })
      return manager.checkStatus()
      .then(function(status) {
        status.should.be.equal(0);
        return manager.read(1262134);
      })
      .then(function(result) {
        result.value = 'test sync';
        return manager.update(result)
      })
      .then(manager.checkStatus.bind(manager))
      .then(function(status) {
        status.should.be.equal(1);
        return helper.notificationPromise(mediator, datasetId, {code:'remote_update_applied', message: {action:'update'}});
      })
      .then(manager.checkStatus.bind(manager))
      .then(function(status) {
        status.should.be.equal(0);
      })
      .then(manager.forceSync.bind(manager))
      .then(function() {
        return helper.notificationPromise(mediator, datasetId, {code:'sync_complete', message:'online'});
      })
      .then(manager.checkStatus.bind(manager))
      .then(function(status) {
        status.should.be.equal(0);
      });
    });
  });

  describe('Single dataset, single user', function() {
    var manager, topic, subscription;

    before(function() {
      helper.startLoggingNotifications(mediator, datasetId);
      return sync.manage(datasetId, null, {user: 'cathy'}).then(function(_manager) {
        manager = _manager;
        return helper.waitForSyncComplete(mediator, datasetId);
      });
    });

    after(function() {
      helper.stopLoggingNotifications(mediator, datasetId);
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
