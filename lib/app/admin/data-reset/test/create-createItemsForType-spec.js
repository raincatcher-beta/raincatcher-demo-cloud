var assert = require('assert');
var sinon = require('sinon');
require('sinon-as-promised');

var create = require('../create');
var sampleData = require('../data-demo/index');

var stubBuilderCreate = require('./util/stubBuilder-create');

describe('Test create', function() {
  var mediatorRequestStub = sinon.stub();
  var mediatorMock = {request: mediatorRequestStub};

  beforeEach(function() {
    mediatorMock.request.reset();
  });


  it('Should create all files from the sample data files', function(done) {
    stubBuilderCreate.buildMediatorCreateStubsForType(mediatorRequestStub, sampleData.file(), 'file');

    create.createItemsForType(mediatorMock, 'file', [])
      .then(function(mappingsForType) {
        assert(mappingsForType);
        done();
      });
  });


  it('Should create all groups from the sample data files', function(done) {
    stubBuilderCreate.buildMediatorCreateStubsForType(mediatorRequestStub, sampleData.group(), 'group');

    create.createItemsForType(mediatorMock, 'group', [])
      .then(function(mappingsForType) {
        assert(mappingsForType);
        done();
      });
  });


  it('Should create all memberships from the sample data files', function(done) {
    stubBuilderCreate.buildMediatorCreateStubsForType(mediatorRequestStub, sampleData.membership(), 'membership');

    create.createItemsForType(mediatorMock, 'membership', [])
      .then(function(mappingsForType) {
        assert(mappingsForType);
        done();
      });
  });


  it('Should create all messages from the sample data files', function(done) {
    stubBuilderCreate.buildMediatorCreateStubsForType(mediatorRequestStub, sampleData.messages(), 'messages');

    create.createItemsForType(mediatorMock, 'messages', [])
      .then(function(mappingsForType) {
        assert(mappingsForType);
        done();
      });
  });


  it('Should create all results from the sample data files', function(done) {
    stubBuilderCreate.buildMediatorCreateStubsForType(mediatorRequestStub, sampleData.result(), 'result');

    create.createItemsForType(mediatorMock, 'result', [])
      .then(function(mappingsForType) {
        assert(mappingsForType);
        done();
      });
  });


  it('Should create all workflows from the sample data files', function(done) {
    stubBuilderCreate.buildMediatorCreateStubsForType(mediatorRequestStub, sampleData.workflows(), 'workflows');

    create.createItemsForType(mediatorMock, 'workflows', [])
      .then(function(mappingsForType) {
        assert(mappingsForType);
        done();
      });
  });

  it('Should create all workorders from the sample data files', function(done) {
    stubBuilderCreate.buildMediatorCreateStubsForType(mediatorRequestStub, sampleData.workorders(), 'workorders');

    create.createItemsForType(mediatorMock, 'workorders', [])
      .then(function(mappingsForType) {
        assert(mappingsForType);
        done();
      });
  });

});