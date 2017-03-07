var _ = require('lodash')
  , q = require('q');
var mediatorManager = require('./mediator-subscribers');


/**
 *
 * Extracting the Data Set data from a $fh.sync Client API response
 *
 * See the $fh.sync Client API documentation for more information on the response format of $fh.sync data set APIs (E.g. doList, doUpdate etc)
 *
 * @param syncResponse
 * @returns {Array}
 */
function extractDataFromSyncResponse(syncResponse) {
  var dataSetData = _.values(syncResponse).map(function(syncData) {
    //Only interested in the actual data from the sync response
    return syncData.data;
  });

  //Sorting the data set by their IDs
  return _.sortBy(dataSetData, function(singleDataSetItem) {
    return singleDataSetItem.id;
  });
}

/**
 *
 * Utility function to format the sync error to the user.
 *
 * @param syncErrorCode - The error code returned from the $fh.sync API.
 * @param syncErrorMessage - The error message returned by the $fh.sync API
 * @returns {string}
 */
function formatSyncErrorMessage(syncErrorCode, syncErrorMessage) {
  var error = 'Error';
  if (syncErrorCode && syncErrorMessage) {
    error += ' ' + syncErrorCode + ': ' + syncErrorMessage;
  } else if (syncErrorCode && !syncErrorMessage) {
    error += ': ' + syncErrorCode;
  } else if (!syncErrorCode && syncErrorMessage) {
    error += ': ' + syncErrorMessage;
  } else {
    error += ': no error details available';
  }
  return error;
}


/**
 * Wrapper class around $fh.sync to allow easier operations on a single data set.
 *
 * The $fh.sync framework emits events for all data sets. This allows these events to be filtered to only the ones
 * required for a single data set. (E.g. workorders, messaages etc.)
 *
 * The $fh.sync client API is used to perform the CRUDL operations on the single data set.
 *
 * (For more information on the $fh.sync Client API, see https://access.redhat.com/documentation/en/red-hat-mobile-application-platform-hosted/3/paged/client-api/chapter-11-fhsync)
 *
 * @param datasetId - The ID of the single data set (E.g. workorders, results, messages etc)
 * @param $fh - A reference to the feedhenry client API. This is used to access the sync Client API.
 * @param dataSetNotificationStream - An observable stream of $fh.sync notification relevant to this data set.
 * @param mediator - A reference to the mediator to use for publishing topics.
 * @constructor
 */
function DataManager(datasetId, $fh, dataSetNotificationStream, mediator) {
  this.datasetId = datasetId;
  this.$fh = $fh;
  this.stream = dataSetNotificationStream;
  this.mediator = mediator;
  this.subscribers = {};

  this.createSyncDataTopicSubscribers();
}

/**
 * Creating all of the mediator subscribers for this sync data set.
 */
DataManager.prototype.createSyncDataTopicSubscribers = function createSyncDataTopicSubscribers() {
  var self = this;

  //If there is no mediator applied, then we can't subscribe to mediator topics.
  if (!self.mediator) {
    return;
  }

  self.SyncSubscribers = mediatorManager.init(self.mediator, self, {datasetId: self.datasetId});
};

/**
 *
 * Removing any subscribers associated with this data set.
 *
 */
DataManager.prototype.removeSyncDataTopicSubscribers = function removeSyncDataTopicSubscribers() {
  var self = this;

  if (!self.mediator) {
    return;
  }

  mediatorManager.tearDown(self.datasetId);
};


/**
 *
 * Function to check whether a notification from the $fh.sync API is relevant.
 *
 * @param {object} notification            - a $fh.sync Notification
 * @param {object} comparison              - a comparison notification object
 * @param {string} comparison.code         - The $fh.sync notification code that is relevant
 * @param {string} comparison.message      - The $fh.sync notification message that is relevant
 * @param {string} comparison.uid          - A Unique identifier for the synchronised document
 * @returns {boolean}
 */
DataManager.prototype.isNotificationRelevant = function isNotificationRelevant(notification, comparison) {
  var self = this;
  //The cached UID of the object may have changed in the sync framework from an update from the server.
  //This updated uid is used for document notifications
  //This call ensure that the correct document uid is used.
  comparison.uid = self.$fh.sync && self.$fh.sync.getUID ? self.$fh.sync.getUID(comparison.uid) : comparison.uid;

  if (comparison.code && notification.code !== comparison.code) {
    return false;
  }

  if (comparison.message && notification.message !== comparison.message) {
    return false;
  }

  if (comparison.uid && notification.uid !== comparison.uid) {
    return false;
  }

  return true;
};

/**
 *
 * Listing all data for this data set.
 *
 * @returns {*|promise}
 */
DataManager.prototype.list = function() {
  var self = this;
  var deferred = q.defer();

  //Using the $fh.sync API to list the data available in this data set.
  self.$fh.sync.doList(self.datasetId, function(syncDataSetList) {
    var dataSetData = extractDataFromSyncResponse(syncDataSetList);
    deferred.resolve(dataSetData);
  }, function handleSyncListError(syncErrorCode, syncErrorMessage) {
    deferred.reject(new Error(formatSyncErrorMessage(syncErrorCode, syncErrorMessage)));
  });
  return deferred.promise;
};


/**
 *
 * Adding a new item to the data set.
 *
 * This function will use the $fh.sync.doCreate function to add the new data.
 *
 * This function will also wait until the data has been added to the local storage by using the
 * "local_update_applied" notification for this data set.
 *
 * @param itemToCreate - The item to add to the data set.
 * @returns {*}
 */
DataManager.prototype.create = function(itemToCreate) {
  var self = this;

  var deferred = q.defer();

  /**
   *
   * Handle successfully creating the new item.
   * At this point, the data will have been persisted to the local store.
   *
   * @param syncDataCreateResult
   * @returns {*}
   */
  function handleCreateSuccess(syncDataCreateResult) {
    itemToCreate._localuid = syncDataCreateResult.uid;
    //Updating the local ID of the data item to be based on the unique identifier of the sync record.
    return self.update(itemToCreate).then(function(itemUpdateResult) {
      deferred.resolve(itemUpdateResult);
    });
  }

  /**
   *
   * Handling an error returned by the doCreate API call
   *
   * @param errorCode
   * @param syncErrorMessage
   */
  function handleCreateError(errorCode, syncErrorMessage) {
    deferred.reject(new Error(formatSyncErrorMessage(errorCode, syncErrorMessage)));
  }

  self.$fh.sync.doCreate(self.datasetId, itemToCreate, handleCreateSuccess, handleCreateError);
  return deferred.promise;
};

/**
 * Reading a single item from the data set.
 * @param id - The local ID of the item to read
 * @returns {*|promise}
 */
DataManager.prototype.read = function(id) {
  var self = this;

  var deferred = q.defer();
  self.$fh.sync.doRead(this.datasetId, id, function(res) {
    // success
    deferred.resolve(res.data);
  }, function(code, msg) {
    // failure
    deferred.reject(new Error(formatSyncErrorMessage(code, msg)));
  });
  return deferred.promise;
};

/**
 *
 * Updating a single item in the data set.
 *
 * @param itemToUpdate
 * @returns {*|promise}
 */
DataManager.prototype.update = function(itemToUpdate) {
  var deferred = q.defer();
  var self = this;
  var itemUid;

  /**
   * Getting the unique ID of the item.
   *
   * If the existingItem has an ID assigned, then assign this to the item to update.
   *
   * The reason for this is that the "id" field of the record is assigned in the remote store.
   *
   * We must be able to relate the item saved locally (Using the _localuid field) to the remote identifier field (id)
   *
   * @param _existingItem
   * @returns {*}
   */
  function getItemId(_existingItem) {
    if (_.has(_existingItem, 'id')) {
      itemToUpdate.id = _existingItem.id;
      return String(_existingItem.id);
    } else {
      return itemToUpdate._localuid;
    }
  }

  /**
   * The update has been applied locally
   */
  function handleUpdateSuccess() {
    return deferred.resolve(self.read(itemUid));
  }

  function handleUpdateError(code, msg) {
    // failure
    deferred.reject(new Error(formatSyncErrorMessage(code, msg)));
  }

  //If the item already has an ID, use this as the identifier.
  //Otherwise, we use the local ID assigned when the item was created.
  var getItemUIDPromise = _.has(itemToUpdate, 'id') ? q.when(String(itemToUpdate.id)) : self.read(itemToUpdate._localuid).then(getItemId);

  getItemUIDPromise.then(function(_itemUid) {
    itemUid = _itemUid;
    self.$fh.sync.doUpdate(self.datasetId, _itemUid, itemToUpdate, handleUpdateSuccess, handleUpdateError);
  });


  return deferred.promise;
};

/**
 *
 * Deleting an item from the data set.
 *
 * @param itemToDelete
 * @returns {*}
 */
DataManager.prototype.delete = function(itemToDelete) {
  var self = this;

  function handleDeleteSuccess() {
    // success
    deferred.resolve();
  }

  function handleDeleteError(code, msg) {
    // failure
    deferred.reject(new Error(formatSyncErrorMessage(code, msg)));
  }

  var deferred = q.defer();
  self.$fh.sync.doDelete(self.datasetId, itemToDelete.id, handleDeleteSuccess, handleDeleteError);
  return deferred.promise;
};

/**
 *
 * Starting the sync management of the data set using the $fh.sync.startSync API. This will start the sync loop, polling for updates
 * and pushing data to the remote server.
 *
 * See the sync Client API docs for more information on $fh.sync.startSync
 *
 * @returns {*}
 */
DataManager.prototype.start = function() {
  var self = this;
  var deferred = q.defer();
  self.$fh.sync.startSync(self.datasetId, function() {
    deferred.resolve('sync loop started');
  }, function(error) {
    deferred.reject(error);
  });
  return deferred.promise;
};

/**
 *
 * Stopping the sync process for this data set.
 *
 * This will stop the sync Client API from sending/recieving updates from the remote server.
 *
 * @returns {*}
 */
DataManager.prototype.stop = function() {
  var deferred = q.defer();
  var self = this;
  self.$fh.sync.stopSync(self.datasetId, function() {
    if (self.recordDeltaReceivedSubscription) {
      self.recordDeltaReceivedSubscription.dispose();
    }
    deferred.resolve('sync loop stopped');
  }, function(error) {
    deferred.reject(error);
  });
  return deferred.promise;
};

/**
 *
 * Forcing the sync framework to do a sync request to the remote server to exchange data.
 *
 * @returns {*}
 */
DataManager.prototype.forceSync = function() {
  var self = this;
  var deferred = q.defer();
  self.$fh.sync.forceSync(this.datasetId, function() {
    deferred.resolve('sync loop will run');
  }, function(error) {
    deferred.reject(error);
  });
  return deferred.promise;
};

/**
 *
 * Get the current number of pending sync requests for this data set.
 *
 * @returns {*}
 */
DataManager.prototype.getQueueSize = function() {
  var self = this;
  var deferred = q.defer();
  self.$fh.sync.getPending(this.datasetId, function(pending) {
    deferred.resolve(_.size(pending));
  });
  return deferred.promise;
};

/**
 *
 * A utility function to push any updates to the remote server and then stop syncing.
 *
 * @param userOptions
 * @returns {*}
 */
DataManager.prototype.safeStop = function(userOptions) {
  var self = this;
  var deferred = q.defer();
  var defaultOptions = {
    timeout: 2000
  };

  var options = _.defaults(userOptions, defaultOptions);

  /**
   *
   * If there are pending sync operations, then force them to sync and then stop syncing.
   *
   *
   * TODO THIS NEEDS REFACTORING
   * @param pendingUpdateQueueSize - The number of records that are waiting to sync to the remote store.
   * @returns {*}
   */
  function forceSyncThenStop(pendingUpdateQueueSize) {
    if (pendingUpdateQueueSize === 0) {
      self.stop().then(deferred.resolve);
      return;
    }

    deferred.notify('Calling forceSync sync before stop');
    return self.forceSync()
      .then(self.waitForSync.bind(self))
      .timeout(options.timeout)
      .then(self.getQueueSize.bind(self))
      .then(function(size) {
        if (size > 0) {
          deferred.reject(new Error('forceSync failed, outstanding results still present'));
        }
      })
      .then(self.stop.bind(self))
      .then(function() {
        deferred.resolve();
      }, function() {
        deferred.reject(new Error('forceSync timeout'));
      });
  }

  self.getQueueSize().then(forceSyncThenStop);
  return deferred.promise;
};

/**
 *
 * Waiting for a sync interval to finish before resolving.
 *
 * This ensures that pending records have synced to the remote store.
 *
 * @returns {*}
 */
DataManager.prototype.waitForSync = function() {
  var deferred = q.defer();
  var self = this;
  self.stream.filter(function(notification) {
    return notification.code === 'sync_complete' || notification.code === 'sync_failed';
  }).take(1).toPromise(q.Promise)
    .then(function(notification) {
      if (notification.code === 'sync_complete') {
        deferred.resolve(notification);
      } else if (notification.code === 'sync_failed') {
        deferred.reject(new Error('Sync Failed', notification));
      }
    });
  return deferred.promise;
};

/**
 *
 * Publishing a wfm:sync topic for this data set that notifies that a the records have changed locally from remote data.
 *
 * @param mediator
 */
DataManager.prototype.publishRecordDeltaReceived = function(mediator) {
  var self = this;

  //If there is a mediator assigned to this manager, then there is already a topic published to cover the record_delta_received notification
  if (self.mediator) {
    return;
  }

  self.recordDeltaReceivedSubscription = self.stream.filter(function(notification) {
    return notification.code === 'record_delta_received';
  }).subscribe(function(notification) {
    mediator.publish('wfm:sync:record_delta_received:' + self.datasetId, notification);
  });
};

module.exports = DataManager;