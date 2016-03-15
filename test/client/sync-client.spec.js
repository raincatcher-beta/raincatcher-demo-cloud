/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
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
      return sync.init($fh, config.syncOptions);
    })
  });

  after(function() {
    return helper.syncServerStop($fh, datasetId).then(function() {
      helper.restoreNavigator();
    });
  });

  describe('Single dataset', function() {
    var manager, subscription;

    before(function() {
      return sync.manage(datasetId).then(function(_manager) {
        manager = _manager;
        subscription = helper.startLoggingNotifications(manager.stream);
        return manager.waitForSync();
      });
    });

    after(function() {
      helper.stopLoggingNotifications(subscription);
      return manager.stop();
    });

    beforeEach(function() {
      var self = this;
      return manager.forceSync()
        .then(manager.waitForSync.bind(manager))
        .then(manager.stop.bind(manager))
        .then(function() {
          return helper.syncServerReset($fh, datasetId)
        })
        .then(manager.start.bind(manager));
    })

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
        console.log(created);
        should.exist(created._localuid);
        should.not.exist(created.id);
        created.value.should.equal('test-client')
        remoteCreatePromise = helper.notificationPromise(manager.stream, {
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
        return q.delay(20).then(function() {
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
        return manager.delete(result)
      })
      .then(function(msg) {
        msg.should.equal('delete');
        return manager.list();
      })
      .then(function(result) {
        result.should.have.length(testData.length - 1);
      });
    });

    it('getQueueSize works', function() {
      return manager.forceSync()
      .then(function() {
        return helper.notificationPromise(manager.stream, {code:'sync_complete', message:'online'});
      })
      .then(manager.getQueueSize.bind(manager))
      .then(function(status) {
        status.should.be.equal(0);
        return manager.read(1262134);
      })
      .then(function(result) {
        result.value = 'test sync';
        return manager.update(result)
      })
      .then(manager.getQueueSize.bind(manager))
      .then(function(status) {
        status.should.be.equal(1);
        return helper.notificationPromise(manager.stream, {code:'remote_update_applied', message: {action:'update'}});
      })
      .then(manager.getQueueSize.bind(manager))
      .then(function(status) {
        status.should.be.equal(0);
      })
      .then(manager.forceSync.bind(manager))
      .then(function() {
        return helper.notificationPromise(manager.stream, {code:'sync_complete', message:'online'});
      })
      .then(manager.getQueueSize.bind(manager))
      .then(function(status) {
        status.should.be.equal(0);
      });
    });

    it('safeStop will error on timeout', function(done) {
      manager.read(1276712)
      .then(function(result) {
        result.value = 'test timeout';
        return manager.update(result);
      })
      .then(function() {
        return manager.safeStop({timeout:0});
      })
      .then(function() {
        throw new Error('this promise shouldnt resolve');
      }, function(error) {
        error.message.should.be.equal('forceSync timeout');
        done();
      });
    });

    it('safeStop works with an outstanding queue', function() {
      var progressMessage;
      return manager.read(1276712)
      .then(function(result) {
        result.value = 'test2';
        return manager.update(result)
      })
      .then(manager.safeStop.bind(manager))
      .then(function() {
        should.exist(progressMessage);
        progressMessage.should.be.equal('Calling forceSync sync before stop');
      }, function(error) {
        throw error;
      }, function(msg) {
        progressMessage = msg;
      })
    });

  });

  describe('Single dataset, single user', function() {
    var manager, subscription;

    before(function() {
      return sync.manage(datasetId, null, {filter: {key: 'user', value: 'cathy'}}).then(function(_manager) {
        manager = _manager;
        subscription = helper.startLoggingNotifications(manager.stream);
        return manager.waitForSync();
      });
    });

    after(function() {
      helper.stopLoggingNotifications(subscription);
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
