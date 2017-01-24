var sinon = require('sinon');
require('sinon-as-promised');

/*
 * This function builds a sinon stub to define the init() behaviour for both array and fh-db store
 */
module.exports.getInitStub = function() {
  var initStub = sinon.stub();
  var mockSeedData = [
    { id: "test-id", value: "test-value"},
    { id: "test2-id", value: "test2-value"}
  ];

  initStub.withArgs(null).resolves(true);
  initStub.withArgs(mockSeedData).resolves(true);
  initStub.withArgs([]).resolves(mockSeedData);

  initStub.throws("Invalid Arguments");

  return initStub;
};

/*
 * This function builds a sinon stub to define the list() behaviour for both array and fh-db store
 */
module.exports.getListStub = function() {
  var listStub = sinon.stub();
  var mockNoDataFhDb = [];
  var mockExistingData = [
    { id: "test-id", value: "test-value"},
    { id: "test2-id", value: "test2-value"}
  ];

  listStub.withArgs().onCall(0).resolves(mockNoDataFhDb);
  listStub.withArgs().onCall(1).resolves(mockNoDataFhDb);
  listStub.withArgs().onCall(2).resolves(mockNoDataFhDb);
  listStub.withArgs().onCall(3).resolves(mockExistingData);

  listStub.throws("Invalid Arguments");

  return listStub;
};

/*
 * This function builds a sinon spy to define the listen() behaviour from the simple-store module
 */
module.exports.getListenSpy = function() {
  return sinon.spy();
};