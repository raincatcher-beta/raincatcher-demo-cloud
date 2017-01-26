var mediator = require('fh-wfm-mediator/lib/mediator');
var sinon = require('sinon');
var assert = require('assert');

describe("Raincatcher Sync Client Initialisation", function() {

  var mockSyncOptions = {
    "sync_frequency": 5,
    "storage_strategy": "dom",
    "do_console_log": false
  };

  var mockDataSetId = "mockdatasetid";

  var mockDataSetFilterParams = {filterParam1: "filtervalue"};
  var mockDataSetMetadataParams = {metadataParam1: "metadatavalue"};

  before(function() {
    var self = this;

    //Clearing the require cache to re-require the client
    self.syncClient = require('../client');

    self.mock$fh = {
      sync: {
        init: sinon.spy(),
        notify: sinon.spy(),
        manage: sinon.stub().callsArg(4)
      }
    };

  });


  it("should not allow a manager to be created if sync has not been initialised", function(done) {
    var self = this;

    self.syncClient.manage(mockDataSetId, mockSyncOptions, mockDataSetFilterParams, mockDataSetMetadataParams).then(function(message) {
      assert.equal('Sync not yet initialized.  Call sync-client.init() first.', message);

      sinon.assert.notCalled(self.mock$fh.sync.manage);

      done();
    });
  });

  it("should Initialise The $fh.sync Client API", function() {
    var self = this;

    self.syncClient.init(self.mock$fh, mockSyncOptions, mediator);

    sinon.assert.calledOnce(self.mock$fh.sync.init);
    sinon.assert.calledWith(self.mock$fh.sync.init, sinon.match(mockSyncOptions));

    sinon.assert.calledOnce(self.mock$fh.sync.notify);
    sinon.assert.calledWith(self.mock$fh.sync.notify, sinon.match.func);
  });

  it("should only initialise the Sync Client once", function() {
    var self = this;

    self.syncClient.init(self.mock$fh, mockSyncOptions, mediator);

    sinon.assert.calledOnce(self.mock$fh.sync.init);

    sinon.assert.calledOnce(self.mock$fh.sync.notify);
  });

  it("should create a new data manager when managing a new data set", function(done) {
    var self = this;
    self.syncClient.manage(mockDataSetId, mockSyncOptions, mockDataSetFilterParams, mockDataSetMetadataParams).then(function() {
      sinon.assert.calledOnce(self.mock$fh.sync.manage);
      sinon.assert.calledWith(self.mock$fh.sync.manage, sinon.match(mockDataSetId), sinon.match(mockSyncOptions), sinon.match(mockDataSetFilterParams), sinon.match(mockDataSetMetadataParams));

      done();
    });
  });

});