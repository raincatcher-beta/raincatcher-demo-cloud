var mediator = require("fh-wfm-mediator/lib/mediator");
var sinon = require('sinon');
require("sinon-as-promised");
var chai = require('chai');
var _ = require('lodash');
var CONSTANTS = require('../../constants');
var expect = chai.expect;
var q = require('q');
var shortid = require('shortid');
var MediatorTopicUtility = require('fh-wfm-mediator/lib/topics');

describe("Sync Create Mediator Topic", function() {
  var createTopic = "wfm:sync:mockdatasetid:create";

  var mockDataToCreate = {
    name: "This is a mock data item"
  };

  var mockDatasetId = "mockdatasetid";

  var syncSubscribers = new MediatorTopicUtility(mediator);
  syncSubscribers.prefix(CONSTANTS.SYNC_TOPIC_PREFIX).entity(mockDatasetId);

  beforeEach(function() {
    this.subscribers = {};
  });

  afterEach(function() {
    _.each(this.subscribers, function(subscriber, topic) {
      mediator.remove(topic, subscriber.id);
    });

    syncSubscribers.unsubscribeAll();
  });

  describe("Create Dataset Item", function() {

    describe("Handling A Successful Creation", function() {

      var doneTopic = "done:wfm:sync:mockdatasetid:create";

      var mockDatasetManager = {
        datasetId: mockDatasetId,
        create: sinon.stub().resolves(mockDataToCreate)
      };

      beforeEach(function() {
        syncSubscribers.on(CONSTANTS.TOPICS.CREATE, require('./create')(syncSubscribers, mockDatasetManager));
      });

      //Verifying the mocks were called with the correct parameters.
      function checkMocksCalled(createResult) {
        expect(createResult).to.deep.equal(createResult);

        sinon.assert.calledOnce(mockDatasetManager.create);
        sinon.assert.calledWith(mockDatasetManager.create, sinon.match(mockDataToCreate));
      }

      beforeEach(function() {
        mockDatasetManager.create.reset();
      });


      it("should handle no unique topic id", function() {
        var testDeferred = q.defer();

        this.subscribers[doneTopic] = mediator.subscribe(doneTopic, testDeferred.resolve);

        mediator.publish(createTopic, {itemToCreate: mockDataToCreate});

        return testDeferred.promise.then(checkMocksCalled);
      });

      it("should handle unique topic id", function() {
        var testDeferred = q.defer();

        var topicUid = shortid.generate();

        this.subscribers[doneTopic] = mediator.subscribe(doneTopic + ":" + topicUid, testDeferred.resolve);

        mediator.publish(createTopic, {
          itemToCreate: mockDataToCreate,
          topicUid: topicUid
        });

        return testDeferred.promise.then(checkMocksCalled);
      });

    });

    describe("Handling the error case", function() {

      var expectedTopicError = new Error("SYNC-Error-Code : Sync Error Message");

      var mockDatasetManager = {
        datasetId: mockDatasetId,
        create: sinon.stub().rejects(expectedTopicError)
      };


      function checkErrorMocksCalled(topicError) {
        expect(topicError).to.deep.equal(expectedTopicError);

        sinon.assert.calledOnce(mockDatasetManager.create);
        sinon.assert.calledWith(mockDatasetManager.create, sinon.match(mockDataToCreate));
      }

      beforeEach(function() {
        mockDatasetManager.create.reset();

        syncSubscribers.on(CONSTANTS.TOPICS.CREATE, require('./create')(syncSubscribers, mockDatasetManager));
      });

      it("should handle no unique topic id", function() {
        var testDeferred = q.defer();


        var errorTopic = "error:wfm:sync:mockdatasetid:create";

        this.subscribers[errorTopic] = mediator.subscribe(errorTopic, testDeferred.resolve);

        mediator.publish(createTopic, {itemToCreate: mockDataToCreate});

        return testDeferred.promise.then(checkErrorMocksCalled);
      });

      it("should handle a unique topic id", function() {
        var testDeferred = q.defer();

        var topicUid = shortid.generate();

        var errorTopic = "error:wfm:sync:mockdatasetid:create:" + topicUid;

        this.subscribers[errorTopic] = mediator.subscribe(errorTopic, testDeferred.resolve);

        mediator.publish(createTopic, {
          itemToCreate: mockDataToCreate,
          topicUid: topicUid
        });

        return testDeferred.promise.then(checkErrorMocksCalled);
      });

    });

  });
});