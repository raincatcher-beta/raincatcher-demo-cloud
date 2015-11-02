'use strict'

debugger;
var $fh = require('../lib/feedhenry')
  , should = require('should')
  , config = require('../test-config')
  , mediator = require('fh-wfm-mediator/mediator')
  , sync = require('../../lib/sync-client')
  , q = require('q')

// alternative to loading fhconfig via xhr
window.fh_app_props = require('../lib/fhconfig.json');

describe('Test the sync framework', function() {
  before(function(done) {
    localStorage.clear();
    sync.init($fh, mediator, config.datasetId, config.syncOptions);
    var topic = 'sync:notification:'+config.datasetId;
    mediator.subscribe(topic, function(event) {
      console.log('**** sync event ****\n', event);
    });
    console.log('listening for events on topic:', topic);
    var deferred = q.defer();
    sync.start().then(function() {
      mediator.subscribe('sync:notification:'+config.datasetId, function(notification) {
        if (notification.code === 'sync_complete') {
          done();
        } else if (notification.code === 'sync_failed') {
          throw new Error('Sync Failed', notification);
        }
      });
    });
  });

  it('Does it blow up?', function() {
    "true".should.be.equal("true");
  });

  it('init the sync', function() {
    debugger;
    return sync.list()
    .then(function(result) {
      console.log('result', result);
      result.should.have.length(1);
    })
    .then(function() {
      return sync.create({id:0, value:'test'})
    })
    // .then(sync.list)
    // .then(function(result) {
    //   console.log('result', result);
    //   result.should.have.length(1);
    // });
  });

});
