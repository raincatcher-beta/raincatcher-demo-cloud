'use strict'

debugger;
var $fh = require('../lib/feedhenry')
  , should = require('should')
  , config = require('../test-config')
  , mediator = require('fh-wfm-mediator/mediator')
  , sync = require('../../lib/sync-client')

// alternative to loading fhconfig via xhr
window.fh_app_props = require('../lib/fhconfig.json');

describe('Test the sync framework', function() {
  before(function() {
    sync.init($fh, config.datasetId, config.syncOptions);
    return sync.start().then(function() {
      console.log('**** start complete ****');
      $fh.sync.notify(function(event) {
        console.log('**** sync event ****\n', event);
      });
    });
  });

  it('Does it blow up?', function() {
    "true".should.be.equal("true");
  });

  it('init the sync', function(done) {
    sync.list()
    .then(sync.create({id:0, value:'test'}))
    .then(sync.list)
    .then(function(result) {
      console.log('result', result);
      result.should.have.length(1);
      done();
    });
  });

});
