'use strict';

var _ = require('lodash')
  , q = require('q')
  , defaultConfig = require('./default-config')
  ;

var $fh, mediator, managers = {}, initialized = false, listeners = [];

function transformDataSet(syncData) {
  var result = _.values(syncData).map(function(syncData) {
    return syncData.data;
  });
  return result;
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

function init(_$fh, _mediator, _syncOptions) {
  $fh = _$fh;
  mediator = _mediator;
  addListener(function(notification) {
    var topic = 'sync:notification:'+notification['dataset_id'];
    mediator.publish(topic, notification);
  });
  if (!initialized) {
    var syncOptions = _syncOptions || defaultConfig.syncOptions;
    $fh.sync.init(syncOptions);
    initialized = true;
    $fh.sync.notify(function(notification) {
      listeners.forEach(function(listener) {
        listener.call(undefined, notification);
      });
    });
  }
};

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

function addListener(listener) {
  listeners.push(listener);
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
  var deferred = q.defer();
  removeLocalVars(object);
  var self = this;
  $fh.sync.doCreate(self.datasetId, object, function(msg) {
    // success
    mediator.promise('sync:notification:' + self.datasetId, {predicate: function(notification) {
      // TODO: instead filter for a local event
      return notification.code == 'record_delta_received'
        && notification.message == 'update'
    }})
    .then(function(notification) {
      return self.read(notification.uid);
    })
    .then(function(result) {
      deferred.resolve(result);
    })
  }, function(code, msg) {
    // failure
    deferred.reject(code + ': ' + msg);
  });
  return deferred.promise;
};

DataManager.prototype.read = function(id) {
  var deferred = q.defer();
  $fh.sync.doRead(this.datasetId, id, function(res) {
    deferred.resolve(res.data);
  }, function(code, msg) {
    // failure
    deferred.reject(code + ': ' + msg);
  });
  return deferred.promise;
};

DataManager.prototype.update = function(object) {
  var deferred = q.defer();
  removeLocalVars(object);
  var self = this;
  $fh.sync.doUpdate(self.datasetId, object.id, object, function(msg) {
    // success
    mediator.promise('sync:notification:' + self.datasetId, {predicate: function(notification) {
      return notification.code == 'local_update_applied'
        && notification.message == 'update'
        && notification.uid == object.id;
    }})
    .then(function(notification) {
      return self.read(notification.uid);
    })
    .then(function(result) {
      deferred.resolve(result);
    })
  }, function(code, msg) {
    // failure
    deferred.reject(code + ': ' + msg);
  });
  return deferred.promise;
};

module.exports = {
  init: init
, manage: manage
, addListener: addListener
}
