'use strict'

debugger;
var $fh = require('../lib/feedhenry')
var should = require('should');
var sync = require('../../lib/sync-client')($fh);

// alternative to loading fhconfig via xhr
window.fh_app_props = require('../lib/fhconfig.json');

describe('Test the sync framework', function() {
  before(function() {
    var promise = sync.init();
    $fh.sync.notify(function(event) {
      console.log('**** sync event ****\n', event);
    });
    return promise;
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
