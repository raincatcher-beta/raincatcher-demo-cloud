'use strict';

var q = require('q');
var syncTestHelper = {};

syncTestHelper.startLoggingNotifications = function(mediator, datasetId) {
  var topic = 'sync:notification:'+datasetId;
  var subscription = mediator.subscribe(topic, function(event) {
    console.log('\x1b[36m%s\x1b[0m', '** sync event:', event.dataset_id, ':', event.code, ':',  event.message);
  });
  console.log('Listening for events on topic:', topic);
}

syncTestHelper.stopLoggingNotifications = function(mediator, datasetId) {
  var topic = 'sync:notification:'+datasetId;
  mediator.remove(topic);
  console.log('Stopped listnening for events on topic:', topic);
}

syncTestHelper.syncServerReset = function($fh) {
  var deferred = q.defer();
  $fh.cloud({
    path: '/sync/reset',
    method: 'GET'
  }, function() {
    deferred.resolve();
  }, function(err) {
    deferred.reject(err);
  })
  return deferred.promise;
}

syncTestHelper.syncServerInit = function($fh, datasetId) {
  var deferred = q.defer();
  $fh.cloud({
    path: '/sync/init/' + datasetId,
    method: 'GET'
  }, function() {
    deferred.resolve();
  }, function(err) {
    deferred.reject(err);
  })
  return deferred.promise;
}

syncTestHelper.syncServerStop = function($fh, datasetId) {
  var deferred = q.defer();
  $fh.cloud({
    path: '/sync/stop/' + datasetId,
    method: 'GET'
  }, function() {
    deferred.resolve();
  }, function(err) {
    deferred.reject(err);
  });
  return deferred.promise;
}

syncTestHelper.overrideNavigator = function() {
  // Overide window.navigator.onLine to make sync work
  if (! navigator.oldNavigator) {
    var fakeNavigator = {};
    for (var i in navigator) {
      fakeNavigator[i] = navigator[i];
    }
    fakeNavigator.onLine = true;
    fakeNavigator.oldNavigator = navigator;
    navigator = fakeNavigator;
  }
}

syncTestHelper.restoreNavigator = function() {
  if (navigator.oldNavigator) {
    navigator = navigator.oldNavigator;
  }
}

syncTestHelper.waitForSyncComplete = function(mediator, datasetId) {
  var deferred = q.defer();
  mediator.promise('sync:notification:'+datasetId, {predicate: function(notification) {
    return notification.code === 'sync_complete' || notification.code === 'sync_failed';
  }}).then(function(notification) {
    if (notification.code === 'sync_complete') {
      deferred.resolve(notification);
    } else if (notification.code === 'sync_failed') {
      deferred.reject(new Error('Sync Failed', notification));
    }
  });
  return deferred.promise;
}

syncTestHelper.waitForNotification = function(mediator, datasetId, code, message) {
  return
}

module.exports = syncTestHelper;
