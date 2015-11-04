'use strict'

debugger;
var $fh = require('../lib/feedhenry')
  , should = require('should')
  , config = require('../test-config')
  , mediator = require('fh-wfm-mediator/mediator')
  , sync = require('../../lib/sync-client')
  , q = require('q')
  , syncTestHelper = require('./test-helper')
  ;

var datasetId = 'sync-client-dataset';

// alternative to loading fhconfig via xhr
window.fh_app_props = require('../lib/fhconfig.json');

describe('Test the sync framework', function() {
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
        result.should.have.length(6);
      })
    });

    it('create works', function() {
      return manager.create({id:10, value:'test-client'})
      .then(function(created) {
        created.value.should.equal('test-client')
        return manager.read(created.id);
      })
      .then(function(result) {
        result.value.should.equal('test-client');
        return manager.list();
      })
      .then(function(result) {
        result.should.have.length(7);
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
        result.should.have.length(6);
      });
    });
  });
});
