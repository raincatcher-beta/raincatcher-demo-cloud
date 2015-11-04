'use strict'

debugger;
var $fh = require('../lib/feedhenry')
  , should = require('should')
  , config = require('../test-config')
  , mediator = require('fh-wfm-mediator/mediator')
  , sync = require('../../lib/wrappers/sync-mediator')(mediator)
  , q = require('q')
  , syncTestHelper = require('./test-helper')
  ;

var datasetId = 'sync-mediator-dataset';

// alternative to loading fhconfig via xhr
window.fh_app_props = require('../lib/fhconfig.json');

describe('Test the sync via mediator', function() {
  before(function() {
    localStorage.clear();
    syncTestHelper.overrideNavigator();

    return syncTestHelper.syncServerInit($fh, datasetId).then(function() {
      var promise = mediator.promise('done:sync:init');
      mediator.publish('sync:init', $fh, config.syncOptions);
      return promise;
    });
  });

  after(function() {
    return syncTestHelper.syncServerStop($fh, datasetId).then(function() {
      syncTestHelper.restoreNavigator();
    });
  });

  describe('Single dataset', function() {
    before(function() {
      syncTestHelper.startLoggingNotifications(mediator, datasetId);
      return mediator.request('sync:manage', datasetId)
      .then(function() {
        return syncTestHelper.waitForSyncComplete(mediator, datasetId);
      });
    });

    after(function() {
      syncTestHelper.stopLoggingNotifications(mediator, datasetId);
      return mediator.request('sync:'+datasetId+':stop');
    });

    it('nothing blows up.', function() {
      'true'.should.be.equal('true');
    });

    it('list result is correct.', function() {
      return mediator.request('sync:'+datasetId+':list:load')
      .then(function(result) {
        result.should.have.length(6);
      })
    });

    it('create works.', function() {
      var ts = new Date().getTime();
      return mediator.request('sync:'+datasetId+':create', [{id:1, value:'test-mediator'}, ts], {uid: ts})
      .then(function() {
        return mediator.request('sync:'+datasetId+':list:load')
      })
      .then(function(result) {
        result.should.have.length(7);
      });
    });

    it('delete works.', function() {
      return mediator.request('sync:'+datasetId+':read', '1262134')
      .then(function(object) {
        return mediator.request('sync:'+datasetId+':delete', object, {uid: object.id});
      })
      .then(function(msg) {
        msg.should.equal('delete');
        return mediator.request('sync:'+datasetId+':list:load')
      })
      .then(function(result) {
        result.should.have.length(6);
      });
    });
  });
});
