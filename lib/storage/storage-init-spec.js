var sinon = require('sinon');
var proxyquire = require('proxyquire');
var should = require('should');
require('sinon-as-promised');

var mediator = require('fh-wfm-mediator/lib/mediator');

var mockConf = {
  persistentStore: true,
  get: function() {
    return mockConf.persistentStore;
  }
};



/**
 * A set of tests for the store-init functionality
 */
describe('Data Store Initialization', function() {
  var mongoConnectionString = "mongodb://localhost/somedb";
  var mockdatasetId = "mockdataset";

  var mockSimpleStore, mockMongooseStore, storeAPI;

  var seedData = [
    { id: "test-id", value: "test-value"},
    { id: "test2-id", value: "test2-value"}
  ];

  function createMocks(dbStub) {

    var storeOptions = {
      './config.js': mockConf,
      './mongoose-store' : mockMongooseStore,
      './simple-store': mockSimpleStore
    };

    if (dbStub) {
      storeOptions['fh-mbaas-api'] = {
        '@global': true,
        db: dbStub
      };
    }

    return proxyquire('./storage-init.js', storeOptions);
  }

  beforeEach(function(done) {
    storeAPI = {
      list: sinon.stub().resolves(),
      init: sinon.stub().resolves(),
      listen: sinon.stub().resolves()
    };

    mockSimpleStore = {
      connect: sinon.stub().resolves()
    };

    mockMongooseStore = {
      connect: sinon.stub(),
      getCollectionStore: sinon.stub().resolves(storeAPI)
    };

    done();
  });

  it("should return an error if dataset initialisation is done before connecting", function() {

    var store = createMocks();

    return store.init().catch(function(err) {
      should(err.message).equal("Connect must be called before trying to initialise a store");
    });

  });

  it("should connect to the mongoose store if there is a mongo url", function() {
    var dbStub = sinon.stub().callsArgWith(1, undefined, mongoConnectionString);

    var store = createMocks(dbStub);

    return store.connect().then(function() {
      sinon.assert.calledOnce(mockMongooseStore.connect);
      sinon.assert.calledWith(mockMongooseStore.connect, sinon.match(mongoConnectionString));

      sinon.assert.notCalled(mockSimpleStore.connect);
    });
  });

  it('should connect to the simple store if there is no mongo url', function() {
    var dbStub = sinon.stub().callsArgWith(1, undefined, undefined);

    var store = createMocks(dbStub);

    return store.connect().then(function() {
      sinon.assert.calledOnce(mockSimpleStore.connect);

      sinon.assert.notCalled(mockMongooseStore.connect);
    });
  });

  it("should initialise a store for a single data set", function() {
    var dbStub = sinon.stub().callsArgWith(1, undefined, mongoConnectionString);

    var store = createMocks(dbStub);

    return store.connect().then(function() {
      return store.init(mockdatasetId, null, mediator).then(function() {
        sinon.assert.calledOnce(storeAPI.list);
        sinon.assert.calledOnce(storeAPI.listen);

        sinon.assert.calledOnce(storeAPI.init);
        sinon.assert.calledWith(storeAPI.init, sinon.match(null));
      });
    });
  });

  it("should initialise a store with initial data", function() {
    var dbStub = sinon.stub().callsArgWith(1, undefined, mongoConnectionString);

    var store = createMocks(dbStub);

    return store.connect().then(function() {
      return store.init(mockdatasetId, seedData, mediator).then(function() {
        sinon.assert.calledOnce(storeAPI.list);
        sinon.assert.calledOnce(storeAPI.listen);

        sinon.assert.calledOnce(storeAPI.init);
        sinon.assert.calledWith(storeAPI.init, sinon.match(seedData));
      });
    });
  });

});