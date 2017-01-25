var sinon = require('sinon');
require('sinon-as-promised');

var remove = require('../remove');
var sampleData = require('../data-demo/index');
var CLOUD_TOPIC_PREFIX  = require('../topics_constants').CLOUD_TOPIC_PREFIX;


describe('Test remove all items for type', function() {
  var mediatorRequestStub = sinon.stub();
  var mediatorMock = {request: mediatorRequestStub};

  beforeEach(function() {
    mediatorMock.request.reset();

  });

  it('Should remove all files', function() {
    sampleData.workorders().forEach( function(file) {
      mediatorRequestStub.withArgs(
        CLOUD_TOPIC_PREFIX + 'file:delete',
        file.id,
        {uid: file.id}
      ).resolves(file.id);
    });

    mediatorRequestStub.withArgs(CLOUD_TOPIC_PREFIX + 'file:list').resolves(sampleData.file());

    return remove.removeAllItemsForType(mediatorMock, 'file');
  });


  it('Should remove all groups', function() {
    sampleData.group().forEach( function(group) {
      mediatorRequestStub.withArgs(
        CLOUD_TOPIC_PREFIX + 'group:delete',
        group.id,
        {uid: group.id}
      ).resolves(group.id);
    });

    mediatorRequestStub.withArgs(CLOUD_TOPIC_PREFIX + 'group:list').resolves(sampleData.group());

    return remove.removeAllItemsForType(mediatorMock, 'group');
  });


  it('Should remove all memberships', function() {
    sampleData.membership().forEach( function(membership) {
      mediatorRequestStub.withArgs(
        CLOUD_TOPIC_PREFIX + 'membership:delete',
        membership.id,
        {uid: membership.id}
      ).resolves(membership.id);
    });

    mediatorRequestStub.withArgs(CLOUD_TOPIC_PREFIX + 'membership:list').resolves(sampleData.membership());

    return remove.removeAllItemsForType(mediatorMock, 'membership');
  });


  it('Should remove all messages', function() {
    sampleData.messages().forEach( function(message) {
      mediatorRequestStub.withArgs(
        CLOUD_TOPIC_PREFIX + 'messages:delete',
        message.id,
        {uid: message.id}
      ).resolves(message.id);
    });

    mediatorRequestStub.withArgs(CLOUD_TOPIC_PREFIX + 'messages:list').resolves(sampleData.messages());

    return remove.removeAllItemsForType(mediatorMock, 'messages');
  });


  it('Should remove all result', function() {
    sampleData.result().forEach( function(result) {
      mediatorRequestStub.withArgs(
        CLOUD_TOPIC_PREFIX + 'result:delete',
        result.id,
        {uid: result.id}
      ).resolves(result.id);
    });

    mediatorRequestStub.withArgs(CLOUD_TOPIC_PREFIX + 'result:list').resolves(sampleData.result());

    return remove.removeAllItemsForType(mediatorMock, 'result');
  });


  it('Should remove all workflows', function() {
    sampleData.workflows().forEach( function(workflow) {
      mediatorRequestStub.withArgs(
        CLOUD_TOPIC_PREFIX + 'workflows:delete',
        workflow.id,
        {uid: workflow.id}
      ).resolves(workflow.id);
    });

    mediatorRequestStub.withArgs(CLOUD_TOPIC_PREFIX + 'workflows:list').resolves(sampleData.workflows());

    return remove.removeAllItemsForType(mediatorMock, 'workflows');
  });

  it('Should remove all workorders', function() {
    sampleData.workorders().forEach( function(workorder) {
      mediatorRequestStub.withArgs(
        CLOUD_TOPIC_PREFIX + 'workorders:delete',
        workorder.id,
        {uid: workorder.id}
      ).resolves(workorder.id);
    });

    mediatorRequestStub.withArgs(CLOUD_TOPIC_PREFIX + 'workorders:list').resolves(sampleData.workorders());

    return remove.removeAllItemsForType(mediatorMock, 'workorders');
  });

});