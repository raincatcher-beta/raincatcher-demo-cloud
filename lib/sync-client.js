'use strict';

var _ = require('lodash');
var config = require('./config');
var q = require('q');

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

module.exports = function($fh) {
  function init() {
    //init the sync
    $fh.sync.init(config.syncOptions);

    //manage the dataSet
    $fh.sync.manage(config.datasetId, {}, {}, {}, function() {
      console.log(config.datasetId + " managed by the sync service ");
      $fh.sync.doList(config.datasetId,
      function(res) {
        var workorders = transformDataSet(res);
      },
      function(err) {
        console.log('Error result from list:', JSON.stringify(err));
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
  }

  var list = function() {
    var d = q.defer();
    $fh.sync.doList(config.datasetId,
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
    $fh.sync.doCreate(config.datasetId, workorder,
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
    $fh.sync.doRead(config.datasetId, id,
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
    $fh.sync.doUpdate(config.datasetId, workorder.id, workorder,
    function(res) {
      d.resolve(res);
    },
    function(err) {
      d.reject(err);
    });
    return d.promise;
  };

  return {
    init: init
  , create: create
  , read: read
  , list: list
  , update: update
  }
}
