'use strict';

var _ = require('lodash')
  , q = require('q')
  , defaultConfig = require('./default-config')
  ;

function transformDataSet(syncData) {
  var workorders = [];
  for (var key in syncData) {
    //putting the array of workorders in the original format again
    var tempObj = {};
    tempObj = syncData[key].data;
    tempObj.finishTimestamp = new Date(tempObj.finishTimestamp);
    workorders.push(tempObj);
  }
  return workorders;
}

function removeLocalVars(workorder) {
  _.keys(workorder).filter(function(key) {
    return key.indexOf('_') === 0;
  }).forEach(function(localKey) {
    delete workorder[localKey];
  });
  if (workorder.steps) {
    _.values(workorder.steps).forEach(function(step) {
      _.keys(step.submission).filter(function(key) {
        return key.indexOf('_') === 0;
      }).forEach(function(localKey) {
        delete step.submission[localKey];
      });
    });
  };
};


var $fh, datasetId, syncOptions;

function init(_$fh, _datasetId, _syncOptions) {
  $fh = _$fh;
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
      asyncGetWorkorder(notification.uid).then( function(result) {mediator.publish('done:workorder:create', result);});
    }
    if (code == "record_delta_received" && notification.message == "update") {
      asyncGetWorkorder(notification.uid).then( function(result) {mediator.publish('done:workorder:save', result);});
    }

  });
  return deferred.promise;
}

var list = function() {
  var d = q.defer();
  $fh.sync.doList(datasetId,
  function(res) {
    var workorders = transformDataSet(res);
    d.resolve(workorders);
  },
  function(err) {
    d.reject(err);
  });
  return d.promise;
};

var create = function(workorder) {
  var d = q.defer();
  removeLocalVars(workorder);
  $fh.sync.doCreate(datasetId, workorder,
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

var update = function(workorder) {
  var d = q.defer();
  removeLocalVars(workorder);
  $fh.sync.doUpdate(datasetId, workorder.id, workorder,
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
