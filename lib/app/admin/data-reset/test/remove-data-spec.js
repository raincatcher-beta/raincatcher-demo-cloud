var sinon = require('sinon');
require('sinon-as-promised');
var remove = require('../remove');
var sampleData = require('../data-demo/index');
var CLOUD_TOPIC_PREFIX  = require('../topics_constants').CLOUD_TOPIC_PREFIX;


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
    mediatorRequestStub.withArgs(CLOUD_TOPIC_PREFIX + 'file:list').resolves(sampleData.file());
    mediatorRequestStub.withArgs(CLOUD_TOPIC_PREFIX + 'group:list').resolves(sampleData.group());
    mediatorRequestStub.withArgs(CLOUD_TOPIC_PREFIX + 'membership:list').resolves(sampleData.membership());
    mediatorRequestStub.withArgs(CLOUD_TOPIC_PREFIX + 'messages:list').resolves(sampleData.messages());
    mediatorRequestStub.withArgs(CLOUD_TOPIC_PREFIX + 'result:list').resolves(sampleData.result());
    mediatorRequestStub.withArgs(CLOUD_TOPIC_PREFIX + 'workflows:list').resolves(sampleData.workflows());
    mediatorRequestStub.withArgs(CLOUD_TOPIC_PREFIX + 'workorders:list').resolves(sampleData.workorders());

    sampleData.file().forEach(function(item) {
      mediatorRequestStub.withArgs(
        CLOUD_TOPIC_PREFIX + 'file:delete',
        item.id,
        {uid: item.id}
      ).resolves(item.id);
    });

    sampleData.group().forEach(function(item) {
      mediatorRequestStub.withArgs(
        CLOUD_TOPIC_PREFIX + 'group:delete',
        item.id,
        {uid: item.id}
      ).resolves(item.id);
    });

    sampleData.membership().forEach(function(item) {
      mediatorRequestStub.withArgs(
        CLOUD_TOPIC_PREFIX + 'membership:delete',
        item.id,
        {uid: item.id}
      ).resolves(item.id);
    });

    sampleData.messages().forEach(function(item) {
      mediatorRequestStub.withArgs(
        CLOUD_TOPIC_PREFIX + 'messages:delete',
        item.id,
        {uid: item.id}
      ).resolves(item.id);
    });

    sampleData.result().forEach(function(item) {
      mediatorRequestStub.withArgs(
        CLOUD_TOPIC_PREFIX + 'result:delete',
        item.id,
        {uid: item.id}
      ).resolves(item.id);
    });
    sampleData.workflows().forEach(function(item) {
      mediatorRequestStub.withArgs(
        CLOUD_TOPIC_PREFIX + 'workflows:delete',
        item.id,
        {uid: item.id}
      ).resolves(item.id);
    });

    sampleData.workorders().forEach(function(item) {
      mediatorRequestStub.withArgs(
        CLOUD_TOPIC_PREFIX + 'workorders:delete',
        item.id,
        {uid: item.id}
      ).resolves(item.id);
    });

  }

});


