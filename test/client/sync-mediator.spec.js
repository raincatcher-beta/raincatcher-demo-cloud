'use strict'

debugger;
var $fh = require('../lib/feedhenry')
  , should = require('should')
  , config = require('../test-config')
  , mediator = require('fh-wfm-mediator/mediator')
  , sync = require('../../lib/wrappers/sync-mediator')(mediator)
  , q = require('q')
  ;

// alternative to loading fhconfig via xhr
window.fh_app_props = require('../lib/fhconfig.json');

describe('Test the sync via mediator', function() {
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

    mediator.publish('sync:init', $fh, config.syncOptions);
  });

  after(function() {
    navigator = oldNavigator;
  });

  describe('Single dataset', function() {
    before(function() {
      return mediator.request('sync:manage', config.datasetId);
    });

    after(function() {
    });

    it('nothing blows up.', function() {
      'true'.should.be.equal('true');
    });

    it('list result is correct.', function() {
      return mediator.request('sync:'+config.datasetId+':list:load')
      .then(function(result) {
        result.should.have.length(6);
      })
    });

    it('create works.', function() {
      var ts = new Date().getTime();
      return mediator.request('sync:'+config.datasetId+':create', [{id:1, value:'test1'}, ts], {uid: ts})
      .then(function() {
        return mediator.request('sync:'+config.datasetId+':list:load')
      })
      .then(function(result) {
        result.should.have.length(7);
      });
    });
  });
});
