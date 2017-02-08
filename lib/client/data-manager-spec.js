var DataManager = require('./data-manager');
var mediator = require("fh-wfm-mediator/lib/mediator");
var sinon = require('sinon');
var assert = require('assert');
var _ = require("lodash");
var Rx = require('rx');
var chai = require('chai');
var expect = chai.expect;

describe("Data Manager", function() {

  var mockDataSetId = "mockdatasetid";
  var dataManager;

  beforeEach(function() {
    var self = this;

    self.mockDataSetNotificationObservableStream = {
      forEach: sinon.spy()
    };
  });


  afterEach(function() {
    dataManager.removeSyncDataTopicSubscribers();
  });


  it("should initialise with a mediator", function() {
    var mock$fh = {};

    dataManager = new DataManager(mockDataSetId, mock$fh, this.mockDataSetNotificationObservableStream, mediator);

    sinon.assert.calledOnce(this.mockDataSetNotificationObservableStream.forEach);

    assert.strictEqual(this.mockDataSetNotificationObservableStream, dataManager.stream);
    assert.strictEqual(mock$fh, dataManager.$fh);
    assert.strictEqual(mediator, dataManager.mediator);
    assert.strictEqual(mockDataSetId, dataManager.datasetId);
  });

  it("should initialise without a mediator", function() {
    var mock$fh = {};

    dataManager = new DataManager(mockDataSetId, mock$fh, this.mockDataSetNotificationObservableStream);

    //It should not have attached a `forEach` filter to the observable stream if there is no mediator
    sinon.assert.notCalled(this.mockDataSetNotificationObservableStream.forEach);

    assert.strictEqual(this.mockDataSetNotificationObservableStream, dataManager.stream);
    assert.strictEqual(mock$fh, dataManager.$fh);
    assert.strictEqual(undefined, dataManager.mediator);
    assert.strictEqual(mockDataSetId, dataManager.datasetId);
  });

  describe("CRUDL Operations", function() {

    it("should list all items", function() {

      //An example of a list API Response From the $fh.sync framework
      var mockSyncDataSetListAPIResponse = {
        "dataentryid": {
          data: {
            id: "SomeDataItemId"
          },
          hash: "somedatahashforthedataset"
        }
      };

      var mock$fh = {
        sync: {
          doList: sinon.stub().callsArgWith(1, mockSyncDataSetListAPIResponse)
        }
      };

      dataManager = new DataManager(mockDataSetId, mock$fh, this.mockDataSetNotificationObservableStream, mediator);

      return dataManager.list().then(function(dataSetList) {

        sinon.assert.calledWith(mock$fh.sync.doList, sinon.match(mockDataSetId), sinon.match.func, sinon.match.func);

        assert.strictEqual(mockSyncDataSetListAPIResponse.dataentryid.data, dataSetList[0]);
      });
    });

    it("should create a new item", function() {

      var mockRecordUid = "syncRecordUID";

      var mockDataItem = {
        name: "mynewdataitem",
        description: "My New Data Item"
      };

      var mockSyncAPIResponse = {
        uid: mockRecordUid
      };

      var expectedCreatedData = _.extend({_localuid: mockSyncAPIResponse.uid}, mockDataItem);

      var mock$fh = {
        sync: {
          doCreate: sinon.stub().callsArgWith(2, mockSyncAPIResponse),
          doUpdate: sinon.stub().callsArgWith(3, mockSyncAPIResponse),
          doRead: sinon.stub().callsArgWith(2, _.extend({data: mockDataItem}, mockSyncAPIResponse))
        }
      };

      dataManager = new DataManager(mockDataSetId, mock$fh, this.mockDataSetNotificationObservableStream, mediator);

      dataManager.create(mockDataItem).then(function(createResult) {
        expect(createResult).to.deep.equal(expectedCreatedData);

        sinon.assert.calledOnce(mock$fh.sync.doCreate);
        sinon.assert.calledWith(mock$fh.sync.doCreate, sinon.match(mockDataSetId), sinon.match(mockDataItem), sinon.match.func, sinon.match.func);

        sinon.assert.calledOnce(mock$fh.sync.doUpdate);
        sinon.assert.calledWith(mock$fh.sync.doUpdate, sinon.match(mockDataSetId), sinon.match(mockSyncAPIResponse.uid), sinon.match(expectedCreatedData), sinon.match.func, sinon.match.func);

        sinon.assert.calledTwice(mock$fh.sync.doRead);
      });
    });

    it("should read a single item", function() {
      var mockRecordUid = "syncRecordUID";

      var mockDataItem = {
        name: "mynewdataitem",
        description: "My New Data Item",
        _localuid: mockRecordUid
      };

      var mockSyncAPIResponse = {
        uid: mockRecordUid
      };

      var mock$fh = {
        sync: {
          doRead: sinon.stub().callsArgWith(2, _.extend({data: mockDataItem}, mockSyncAPIResponse))
        }
      };


      dataManager = new DataManager(mockDataSetId, mock$fh, this.mockDataSetNotificationObservableStream, mediator);

      return dataManager.read(mockRecordUid).then(function(readRecord) {
        expect(readRecord).to.deep.equal(mockDataItem);

        sinon.assert.calledOnce(mock$fh.sync.doRead);
        sinon.assert.calledWith(mock$fh.sync.doRead, sinon.match(mockDataSetId), sinon.match(mockRecordUid), sinon.match.func, sinon.match.func);

      });

    });


    it("should update a new item", function() {

      var mockRecordUid = "syncRecordUID";

      var mockDataItem = {
        _localuid: mockRecordUid,
        name: "mynewdataitem",
        description: "My New Data Item"
      };

      var mockSyncAPIResponse = {
        uid: mockRecordUid
      };

      var expectedCreatedData = _.extend({_localuid: mockSyncAPIResponse.uid}, mockDataItem);

      var mock$fh = {
        sync: {
          doUpdate: sinon.stub().callsArgWith(3, mockSyncAPIResponse),
          doRead: sinon.stub().callsArgWith(2, _.extend({data: mockDataItem}, mockSyncAPIResponse))
        }
      };

      dataManager = new DataManager(mockDataSetId, mock$fh, this.mockDataSetNotificationObservableStream, mediator);

      return dataManager.update(mockDataItem).then(function(createResult) {
        expect(createResult).to.deep.equal(expectedCreatedData);

        sinon.assert.calledOnce(mock$fh.sync.doUpdate);
        sinon.assert.calledWith(mock$fh.sync.doUpdate, sinon.match(mockDataSetId), sinon.match(mockSyncAPIResponse.uid), sinon.match(expectedCreatedData), sinon.match.func, sinon.match.func);

        sinon.assert.calledTwice(mock$fh.sync.doRead);
      });
    });

    it("should remove a single item", function() {
      var mockRecordUid = "syncRecordUID";

      var mockDataItem = {
        id: "dataitemid",
        _localuid: mockRecordUid,
        name: "mynewdataitem",
        description: "My New Data Item"
      };

      var mock$fh = {
        sync: {
          doDelete: sinon.stub().callsArgWith(2)
        }
      };

      dataManager = new DataManager(mockDataSetId, mock$fh, this.mockDataSetNotificationObservableStream, mediator);

      return dataManager.delete(mockDataItem).then(function() {

        sinon.assert.calledOnce(mock$fh.sync.doDelete);
        sinon.assert.calledWith(mock$fh.sync.doDelete, sinon.match(mockDataSetId), sinon.match(mockDataItem.id), sinon.match.func, sinon.match.func);
      });
    });
  });

  it("should publish topics from the data set notification stream", function() {
    var self = this;
    var mockSyncNotification = {
      code: 'sync_notification_code',
      message: "Sync Notification Message"
    };

    //Creating an observable stream that I can manually pust notification events to.
    var syncNotificationStream = Rx.Observable.create(function(observableStream) {
      self.observableStream = observableStream;
    }).share();

    var mock$fh = {};

    var syncNotificationSubscriber = sinon.spy();

    mediator.subscribe('wfm:sync:mockdatasetid:sync_notification_code', syncNotificationSubscriber);

    dataManager = new DataManager(mockDataSetId, mock$fh, syncNotificationStream, mediator);

    sinon.assert.notCalled(syncNotificationSubscriber);

    //Pusing an event to the stream
    self.observableStream.onNext(mockSyncNotification);

    sinon.assert.calledOnce(syncNotificationSubscriber);
    sinon.assert.calledWith(syncNotificationSubscriber, mockSyncNotification);
  });

});