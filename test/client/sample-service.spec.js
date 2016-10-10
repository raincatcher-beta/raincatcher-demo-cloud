'use strict';

var $fh = require('../lib/feedhenry')
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

require('./sample-service');

describe('Test a consumer of the sync framework', function() {
  var object1Sync, object2Sync;

  before(function() {
    localStorage.clear();
    helper.overrideNavigator();
    return q.all([
      helper.syncServerInit($fh, 'sample-dataset-id-1'),
      helper.syncServerInit($fh, 'sample-dataset-id-2')
    ]);
  });

  after(function() {
    return q.all([
      helper.syncServerStop($fh, 'sample-dataset-id-1'),
      helper.syncServerStop($fh, 'sample-dataset-id-2')
    ])
    .then(function() {
      helper.restoreNavigator();
    });
  });

  beforeEach('angular init', function() {
    angular.mock.module('sync-service.consumer');
    angular.mock.module(function($provide) {
      $provide.value('$q', q);
    });
    angular.mock.inject(function(_object1Sync_, _object2Sync_) {
      object1Sync = _object1Sync_;
      object2Sync = _object2Sync_;
    });
    return object1Sync.managerPromise;
  });

  beforeEach('wait for sync', function() {
    return q.all([
      object1Sync.manager.waitForSync(),
      object2Sync.manager.waitForSync()
    ]);
  });

  afterEach(function() {
    return q.all([
      object1Sync.manager.stop(),
      object2Sync.manager.stop()
    ]);
  });

  it('nothing blows up', function() {
    'true'.should.be.equal('true');
  });

  it('list 1 result is correct', function() {
    return object1Sync.manager.list()
    .then(function(result) {
      result.should.have.length(testData.length);
    });
  });

  it('list 2 result is correct', function() {
    return object2Sync.manager.list()
    .then(function(result) {
      result.should.have.length(testData.length);
    });
  });

});
