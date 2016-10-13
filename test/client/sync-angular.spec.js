'use strict';

var $fh = require('../lib/feedhenry')
  , config = require('../test-config')
  , q = require('q')
  , helper = require('./test-helper')
  , testData = require('../test-data')
  , angular = require('angular')
  ;

require('angular-mocks');
// alternative to loading fhconfig via xhr
window.fh_app_props = require('../lib/fhconfig.json');
window.$fh = $fh;
window.angular = angular;

require('../../lib/angular/sync-ng.js');

describe('Test the sync framework', function() {
  var sync;
  var datasetId = 'sync-client-dataset';
  var manager, subscription;

  before(function() {
    localStorage.clear();
    helper.overrideNavigator();
    return helper.syncServerInit($fh, datasetId);
  });

  after(function() {
    return helper.syncServerStop($fh, datasetId).then(function() {
      helper.restoreNavigator();
    });
  });

  beforeEach('angular init', function() {
    angular.mock.module('wfm.sync.service');
    angular.mock.module(function($provide) {
      $provide.value('$q', q);
    });
    angular.mock.inject(function(_syncService_) {
      sync = _syncService_;
    });
  });

  beforeEach('sync init', function() {
    return sync.init($fh, config.syncOptions);
  });

  beforeEach('sync manage', function() {
    return sync.manage(datasetId).then(function(_manager) {
      manager = _manager;
      subscription = helper.startLoggingNotifications(manager.stream);
      return manager.waitForSync();
    });
  });

  afterEach(function() {
    helper.stopLoggingNotifications(subscription);
    return manager.stop();
  });

  it('nothing blows up', function() {
    'true'.should.be.equal('true');
  });

  it('list result is correct', function() {
    return manager.list()
    .then(function(result) {
      result.should.have.length(testData.length);
    });
  });
});
