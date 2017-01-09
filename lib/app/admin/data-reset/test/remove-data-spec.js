var sinon = require('sinon');
require('sinon-as-promised');


var remove = require('../remove');
var sampleData = require('../data-demo/index');


describe('Test remove all data', function() {
  var mediatorRequestStub = sinon.stub();
  var mediatorMock = {request: mediatorRequestStub};


  beforeEach(function() {
    mediatorMock.request.reset();
  });


  it('Should remove all data', function() {
    buildMediatorStubs();
    return remove.removeData(mediatorMock);
  });


  /**
   * Build stubs to list and remove items
   * :list - should resolve to an array
   * :delete - resolves to an ID of the removed item
   */
  function buildMediatorStubs() {
    mediatorRequestStub.withArgs('wfm:cloud:file:list').resolves(sampleData.file());
    mediatorRequestStub.withArgs('wfm:cloud:group:list').resolves(sampleData.group());
    mediatorRequestStub.withArgs('wfm:cloud:membership:list').resolves(sampleData.membership());
    mediatorRequestStub.withArgs('wfm:cloud:messages:list').resolves(sampleData.messages());
    mediatorRequestStub.withArgs('wfm:cloud:result:list').resolves(sampleData.result());
    mediatorRequestStub.withArgs('wfm:cloud:workflows:list').resolves(sampleData.workflows());
    mediatorRequestStub.withArgs('wfm:cloud:workorders:list').resolves(sampleData.workorders());

    sampleData.file().forEach(function(item) {
      mediatorRequestStub.withArgs(
        'wfm:cloud:file:delete',
        item.id,
        {uid: item.id}
      ).resolves(item.id);
    });

    sampleData.group().forEach(function(item) {
      mediatorRequestStub.withArgs(
        'wfm:cloud:group:delete',
        item.id,
        {uid: item.id}
      ).resolves(item.id);
    });

    sampleData.membership().forEach(function(item) {
      mediatorRequestStub.withArgs(
        'wfm:cloud:membership:delete',
        item.id,
        {uid: item.id}
      ).resolves(item.id);
    });

    sampleData.messages().forEach(function(item) {
      mediatorRequestStub.withArgs(
        'wfm:cloud:messages:delete',
        item.id,
        {uid: item.id}
      ).resolves(item.id);
    });

    sampleData.result().forEach(function(item) {
      mediatorRequestStub.withArgs(
        'wfm:cloud:result:delete',
        item.id,
        {uid: item.id}
      ).resolves(item.id);
    });
    sampleData.workflows().forEach(function(item) {
      mediatorRequestStub.withArgs(
        'wfm:cloud:workflows:delete',
        item.id,
        {uid: item.id}
      ).resolves(item.id);
    });

    sampleData.workorders().forEach(function(item) {
      mediatorRequestStub.withArgs(
        'wfm:cloud:workorders:delete',
        item.id,
        {uid: item.id}
      ).resolves(item.id);
    });

  }

});


