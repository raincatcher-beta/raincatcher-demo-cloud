var sinon = require('sinon');
require('sinon-as-promised');


var create = require('../create');

var stubBuilderCreate = require('./util/stubBuilder-create');


describe('Test build data', function() {
  var mediatorRequestStub = sinon.stub();
  var mediatorMock = {request: mediatorRequestStub};

  beforeEach(function() {
    mediatorMock.request.reset();
  });


  it('Should build all the data sets using sample seed data.', function() {
    stubBuilderCreate.buildMediatorCreateStubsForAll(mediatorRequestStub);
    var buildData = create.getBuildDataFunction(mediatorMock);
    buildData();
  });

});