'use strict';

var _ = require('lodash')
  , q = require('q')
  , defaultConfig = require('./default-config')
  ;

var $fh, mediator, datasetId, syncOptions;

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

function init(_$fh, _mediator, _datasetId, _syncOptions) {
  $fh = _$fh;
  mediator = _mediator;
  datasetId = _datasetId;
  syncOptions = _syncOptions || defaultConfig.syncOptions;
  //init the sync
  $fh.sync.init(syncOptions);
};

function start() {
  var deferred = q.defer();
  //manage the dataSet
  $fh.sync.manage(datasetId, {}, {}, {}, function() {
    deferred.resolve({
      datasetId: datasetId
    });
  });

  //provide listeners for sync notifications
  $fh.sync.notify(function(notification) {
    var code = notification.code

    if (code == "record_delta_received" && notification.message == "create") {
      read(notification.uid).then( function(result) {mediator.publish('sync:notification:'+datasetId+':create', result);});
    }
    if (code == "record_delta_received" && notification.message == "update") {
      read(notification.uid).then( function(result) {mediator.publish('sync:notification:'+datasetId+':update', result);});
    }
  });

  return deferred.promise;
}

var list = function() {
  var d = q.defer();
  $fh.sync.doList(datasetId,
  function(res) {
    var objects = transformDataSet(res);
    d.resolve(objects);
  },
  function(err) {
    d.reject(err);
  });
  return d.promise;
};

var create = function(object) {
  var d = q.defer();
  removeLocalVars(object);
  $fh.sync.doCreate(datasetId, object,
  function(res) {
    d.resolve(res);
  },
  function(err) {
    d.reject(err);
  });
  return d.promise;
};

var read = function(id) {
  var d = q.defer();
  $fh.sync.doRead(datasetId, id,
  function(res) {
    if (res.data.finishTimestamp) {
      res.data.finishTimestamp = new Date(res.data.finishTimestamp);
    }
    d.resolve(res.data);
  },
  function(err) {
    d.reject(err);
  });
  return d.promise;
};

var update = function(object) {
  var d = q.defer();
  removeLocalVars(object);
  $fh.sync.doUpdate(datasetId, object.id, object,
  function(res) {
    d.resolve(res);
  },
  function(err) {
    d.reject(err);
  });
  return d.promise;
};

module.exports = {
  init: init
, start: start
, create: create
, read: read
, list: list
, update: update
}
