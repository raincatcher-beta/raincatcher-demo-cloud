'use strict';

var _ = require('lodash')
  , q = require('q')
  , defaultConfig = require('./default-config')
  ;

var $fh, managers = {}, initialized = false;

function transformDataSet(syncData) {
  return _.values(syncData).map(function(syncData) {
    return syncData.data;
  });
}

function removeLocalVars(object) {
  _.keys(object).filter(function(key) {
    return key.indexOf('_') === 0;
  }).forEach(function(localKey) {
    delete object[localKey];
  });
  if (object.steps) {
    _.values(object.steps).forEach(function(step) {
      _.keys(step.submission).filter(function(key) {
        return key.indexOf('_') === 0;
      }).forEach(function(localKey) {
        delete step.submission[localKey];
      });
    });
  };
};

function init(_$fh, _syncOptions) {
  $fh = _$fh;
  if (!initialized) {
    var syncOptions = _syncOptions || defaultConfig.syncOptions;
    $fh.sync.init(syncOptions);
    initialized = true;
  }
};

function eventBridge(mediator) {
  //provide listeners for sync notifications
  $fh.sync.notify(function(notification) {
    var topic = 'sync:notification:'+notification['dataset_id'];
    mediator.publish(topic, notification);
  });
}

function manage(datasetId) {
  var deferred = q.defer();
  //manage the dataSet
  if (managers[datasetId]) {
    setTimeout(function() {
      deferred.resolve(managers[datasetId]);
    }, 0);
  } else {
    $fh.sync.manage(datasetId, {}, {}, {}, function() {
      var manager = new DataManager(datasetId);
      managers[datasetId] = manager;
      deferred.resolve(manager);
    });
  }
  return deferred.promise;
}

function DataManager(datasetId) {
  this.datasetId = datasetId;
}

DataManager.prototype.list = function() {
  var d = q.defer();
  $fh.sync.doList(this.datasetId, function(res) {
    var objects = transformDataSet(res);
    d.resolve(objects);
  }, function(err) {
    d.reject(err);
  });
  return d.promise;
};

DataManager.prototype.create = function(object) {
  var d = q.defer();
  removeLocalVars(object);
  $fh.sync.doCreate(this.datasetId, object, function(res) {
    d.resolve(res);
  }, function(err) {
    d.reject(err);
  });
  return d.promise;
};

DataManager.prototype.read = function(id) {
  var d = q.defer();
  $fh.sync.doRead(this.datasetId, id, function(res) {
    if (res.data.finishTimestamp) {
      res.data.finishTimestamp = new Date(res.data.finishTimestamp);
    }
    d.resolve(res.data);
  }, function(err) {
    d.reject(err);
  });
  return d.promise;
};

DataManager.prototype.update = function(object) {
  var d = q.defer();
  removeLocalVars(object);
  $fh.sync.doUpdate(this.datasetId, object.id, object, function(res) {
    d.resolve(res);
  }, function(err) {
    d.reject(err);
  });
  return d.promise;
};

module.exports = {
  init: init
, eventBridge: eventBridge
, manage: manage
}
