var sinon = require('sinon');
var proxyquire = require('proxyquire');
var mediator = require('fh-wfm-mediator/lib/mediator');
var mockSimpleStore = require('./mocks/mockSimpleStore.js');
var SimpleStore = require('fh-wfm-simple-store');

/**
 * A set of tests for the store-init functionality
 */
describe('Data Store Initialization', function() {
  var store = proxyquire('./store-init.js', {
    'fh-wfm-simple-store': SimpleStore
  });
  var NoSeedData = null;
  var seedData = [
    { id: "test-id", value: "test-value"},
    { id: "test2-id", value: "test2-value"}
  ];
  var mockList = sinon.stub(SimpleStore.prototype, "list", mockSimpleStore.getListStub());
  var mockInit = sinon.stub(SimpleStore.prototype, "init", mockSimpleStore.getInitStub());
  var mockListen = sinon.stub(SimpleStore.prototype, "listen", mockSimpleStore.getListenSpy());

  afterEach(function(done) {
    mockInit.reset();
    mockListen.reset();
    done();
  });

  it('should initialize store with given seed data', function(done) {
    store.init('test-dataset-id', seedData, mediator).then(function() {
      sinon.assert.callCount(mockList, 1);
      sinon.assert.calledOnce(mockInit);
      sinon.assert.calledWith(mockInit, seedData);
      sinon.assert.calledOnce(mockListen);
      done();
    });
  });

  it('should initialize fh-db-store with no data if no seed data is given', function(done) {
    store.init('test-dataset-id', NoSeedData, mediator).then(function() {
      sinon.assert.callCount(mockList, 2);
      sinon.assert.calledOnce(mockInit);
      sinon.assert.calledWith(mockInit, null);
      sinon.assert.calledOnce(mockListen);
      done();
    });
  });

  it('should initialize array-store with no data if no seed data is given', function(done) {
    process.env.WFM_USE_MEMORY_STORE = "true"; //Will be changed to require('fh-wfm-simple-store')({persistent: true});
    store.init('test-dataset-id', NoSeedData, mediator).then(function() {
      sinon.assert.callCount(mockList, 3);
      sinon.assert.calledOnce(mockInit);
      sinon.assert.calledWith(mockInit, []);
      sinon.assert.calledOnce(mockListen);
      done();
    });
  });

  it('should skip initialization store if it has already been initialized', function(done) {
    store.init('test-dataset-id', seedData, mediator).then(function() {
      sinon.assert.callCount(mockList, 4);
      sinon.assert.notCalled(mockInit);
      sinon.assert.calledOnce(mockListen);
      done();
    });
  });

});