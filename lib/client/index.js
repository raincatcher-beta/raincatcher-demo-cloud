'use strict';

var _ = require('lodash')
  , q = require('q')
  , defaultConfig = require('../config')
  , Rx = require('rx')
  , DataManager = require('./data-manager');


var $fh,
  initialized = false,
  syncNotificationStream,
  syncNotifyListeners = [],
  mediator, dataSetManagerPromises = {};

/**
 *
 * Adding a single listener to be executed whenever a $fh.notify handler is executed.
 *
 * @param listener
 */
function addListener(listener) {
  syncNotifyListeners.push(listener);
}

/**
 * Initialising the $fh.sync client and registering a notification handler.
 *
 * The notification handler is an observable stream to allow different data sets to subscribe to notifications
 * that are specific to them.
 *
 * This is because the $fh.sync client API has a single notification handler for all data sets.
 *
 * E.g. the workorders data set is only interested in notifications related to the workorders data set.
 *
 * (For more information on the $fh.sync Client API, see https://access.redhat.com/documentation/en/red-hat-mobile-application-platform-hosted/3/paged/client-api/chapter-11-fhsync)
 *
 * @param _$fh - The feedhenry client API.
 * @param _syncOptions - The options to configure the sync client. See link above for available options.
 * @param _mediator - The mediator to use for publishing topics.
 */
function init(_$fh, _syncOptions, _mediator) {
  if (initialized) {
    return;
  }

  //Assigning a single mediator for the module.
  //All data managers will use the same mediator to publish topics to.
  mediator = _mediator;

  $fh = _$fh;

  //Adding a listener that will be executed every time the notify handler is executed.
  //This listener function will send the syncNotification object (see documentation above) to the syncNotification stream, which in turn will propigate though any
  //other streams attached to it.
  function addObserverStreamListener(syncNotificationsObserver) {
    addListener(function(syncNotification) {
      syncNotificationsObserver.onNext(syncNotification);
    });
  }

  //Creating a single notification stream that will be used to handle all notifications from the $fh.sync API.
  syncNotificationStream = Rx.Observable.create(addObserverStreamListener).share();

  var syncOptions = _.defaults(_syncOptions, defaultConfig.syncOptions);

  //Initialising the $fh.sync API with the required options.
  $fh.sync.init(syncOptions);
  initialized = true;

  //Registering a notification listener with the $fh.sync API. This will be called for all data sets managed by the
  //sync framework.
  $fh.sync.notify(function(syncNotification) {
    syncNotifyListeners.forEach(function(syncNotifyListener) {
      syncNotifyListener.call(undefined, syncNotification);
    });
  });
}


/**
 *
 * Function to create a manager for a single data set (e.g. workorders, messages etc).
 *
 * This will use the $fh.sync.manage API call to manage a specific data set. In addition, another Observable stream
 * will be created to filter out notification messages for messages that are only relevant to this data set.
 *
 * @param datasetId - An identifier for the data set (E.g. workorders, results etc)
 * @param options - Data Set specific options for the data set (See $fh.sync documentation linked above for more information on data set parameters)
 * @param queryParams - Parameters to pass when performing sync operations (See $fh.sync documentation linked above for more information on data set query parameters)
 * @param metaData - Any metadata to be passed with the sync operations. (See $fh.sync documentation linked above for more information on data set query parameters)
 * @returns {*|promise}
 */
function manage(datasetId, options, queryParams, metaData) {
  var deferred = q.defer();

  //The $fh.sync API needs to be initialised before a data set can be managed.
  if (!initialized) {
    deferred.reject(new Error('Sync not yet initialized.  Call sync-client.init() first.'));
    return deferred.promise;
  }

  //If there is already a manager initialising for this dataset, return the promise.
  if (dataSetManagerPromises[datasetId]) {
    return dataSetManagerPromises[datasetId];
  }

  var deferredManagerDeferred = q.defer();
  dataSetManagerPromises[datasetId] = deferredManagerDeferred.promise;

  //Using the $fh.sync API to manage a single data set with the passed parameters above.
  $fh.sync.manage(datasetId, options, queryParams, metaData, function() {
    //Creating another observable stream that is filtered by the ID of th data set created.
    //This ensures that the created manager only gets notifications for the relevant data set.
    var dataSetNotificationStream = syncNotificationStream.filter(function(syncNotification) {
      return syncNotification.dataset_id === datasetId;
    });

    //Creating a single manager for the data set.
    //This is used to encapsulate all of the functionality available to a single data set (E.g. CRDUL operations for workorders).
    var manager = new DataManager(datasetId, $fh, dataSetNotificationStream, mediator);

    deferredManagerDeferred.resolve(manager);
  });

  return dataSetManagerPromises[datasetId];
}


module.exports = {
  init: init
  , manage: manage
  , addListener: addListener
};
