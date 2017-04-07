var sinon = require('sinon');
var proxyquire = require('proxyquire');
var mediator = require('fh-wfm-mediator/lib/mediator');
var mockStore = require('../test/mocks/mockStore.js');
var mockConf = {
  persistentStore: true,
  get: function() {
    return mockConf.persistentStore;
  }
};
var SelectedStore = function(datasetId) {
  this.datasetId = datasetId;
};
SelectedStore.prototype.list = function() {};
SelectedStore.prototype.init = function() {};
SelectedStore.prototype.listen = function() {};

var mockSelectStore = function() {
  return SelectedStore;
};

/**
 * A set of tests for the store-init functionality
 */
describe('Data Store Initialization', function() {
  var mockList = sinon.stub(SelectedStore.prototype, "list", mockStore.getListStub());
  var mockInit = sinon.stub(SelectedStore.prototype, "init", mockStore.getInitStub());
  var mockListen = sinon.stub(SelectedStore.prototype, "listen", mockStore.getListenSpy());

  var store = proxyquire('./store-init.js', {
    './config.js': mockConf,
    'fh-wfm-simple-store' : mockSelectStore
  });

  var NoSeedData = null;
  var seedData = [
    { id: "test-id", value: "test-value"},
    { id: "test2-id", value: "test2-value"}
  ];

  afterEach(function(done) {
    mockInit.reset();
    mockListen.reset();
    done();
  });

  it('should initialize store with given seed data', function() {
    var promise = store.init('test-dataset-id', seedData, mediator);
    return promise.then(function() {
      sinon.assert.callCount(mockList, 1);
      sinon.assert.calledOnce(mockInit);
      sinon.assert.calledWith(mockInit, seedData);
      sinon.assert.calledOnce(mockListen);
    });
  });

  it('should initialize fh-db-store with no data if no seed data is given', function() {
    var promise = store.init('test-dataset-id', NoSeedData, mediator);
    return promise.then(function() {
      sinon.assert.callCount(mockList, 2);
      sinon.assert.calledOnce(mockInit);
      sinon.assert.calledWith(mockInit, null);
      sinon.assert.calledOnce(mockListen);
    });
  });

  it('should initialize array-store with no data if no seed data is given', function() {
    mockConf.persistentStore = false;
    var promise = store.init('test-dataset-id', NoSeedData, mediator);
    return promise.then(function() {
      sinon.assert.callCount(mockList, 3);
      sinon.assert.calledOnce(mockInit);
      sinon.assert.calledWith(mockInit, []);
      sinon.assert.calledOnce(mockListen);
    });
  });

  it('should skip initialization store if it has already been initialized', function() {
    var promise = store.init('test-dataset-id', seedData, mediator);
    return promise.then(function() {
      sinon.assert.callCount(mockList, 4);
      sinon.assert.notCalled(mockInit);
      sinon.assert.calledOnce(mockListen);
    });
  });

});