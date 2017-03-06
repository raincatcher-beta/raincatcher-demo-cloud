
var sinon = require('sinon');
require('sinon-as-promised');
var _ = require('lodash');
var sampleData = require('./../../data-demo/index');
var shortid = require('shortid');

/**
 * Build stubs to list and remove items
 * :create - resolves to an ID of the removed item
 */
function buildMediatorCreateStubsForAll(mediatorRequestStub) {
  sampleData.file().forEach(function(item) {
    buildStub(mediatorRequestStub, item,  'file');
  });

  sampleData.group().forEach(function(item) {
    buildStub(mediatorRequestStub, item,  'group');
  });

  sampleData.membership().forEach(function(item) {
    buildStub(mediatorRequestStub, item,  'membership');
  });

  sampleData.messages().forEach(function(item) {
    buildStub(mediatorRequestStub, item,  'messages');
  });

  sampleData.result().forEach(function(item) {
    buildStub(mediatorRequestStub, item,  'result');
  });

  sampleData.workflows().forEach(function(item) {
    buildStub(mediatorRequestStub, item,  'workflows');
  });

  sampleData.workorders().forEach(function(item) {
    buildStub(mediatorRequestStub, item,  'workorders');
  });
}


function buildMediatorCreateStubsForType(mediatorRequestStub, typeList, type) {
  typeList.forEach(function(item) {
    buildStub(mediatorRequestStub, item,  type);
  });
}

function buildStub(mediatorRequestStub, item,  type) {
  var createdItem = _.cloneDeep(item);
  createdItem.id = shortid.generate();

  var topic = 'wfm:cloud:data:' + type +':create';
  mediatorRequestStub.withArgs(
    topic,
    [sinon.match.object, item.id],
    {uid: item.id}
  ).resolves(createdItem);
}

module.exports = {
  buildMediatorCreateStubsForAll: buildMediatorCreateStubsForAll,
  buildMediatorCreateStubsForType: buildMediatorCreateStubsForType
};