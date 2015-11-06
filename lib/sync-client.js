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

function formatError(code, msg) {
  var error = 'Error';
  if (code && msg) {
    error += ' ' + code + ': ' + msg;
  } else if (code && !msg) {
    error += ': ' + code;
  } else if (!code && msg) {
    error += ': ' + msg;
  } else {
    error += ': no error details available'
  }
  return error;
}

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
  var deferred = q.defer();
  $fh.sync.doList(this.datasetId, function(res) {
    var objects = transformDataSet(res);
    deferred.resolve(objects);
  }, function(code, msg) {
    deferred.reject(new Error(formatError(code, msg)));
  });
  return deferred.promise;
};

DataManager.prototype.create = function(object) {
  var deferred = q.defer();
  var self = this;
  $fh.sync.doCreate(self.datasetId, object, function(msg) {
    // success
    mediator.promise('sync:notification:' + self.datasetId, {predicate: function(notification) {
      return notification.code == 'local_update_applied'
        && notification.message == 'create'
        ; // && notification.uid == object._localuid;  TODO: get the sync framework to return the temporary uid
    }})
    .then(function(notification) {
      object._localuid = msg.uid;
      return self.update(object);
    })
    .then(function(result) {
      deferred.resolve(result);
    })
  }, function(code, msg) {
    // failure
    deferred.reject(new Error(formatError(code, msg)));
  });
  return deferred.promise;
};

DataManager.prototype.read = function(id) {
  var deferred = q.defer();
  $fh.sync.doRead(this.datasetId, id, function(res) {
    // success
    deferred.resolve(res.data);
  }, function(code, msg) {
    // failure
    deferred.reject(new Error(formatError(code, msg)));
  });
  return deferred.promise;
};

DataManager.prototype.update = function(object) {
  var deferred = q.defer();
  var self = this;
  $fh.sync.doUpdate(self.datasetId, object.id || object._localuid, object, function(msg) {
    // success
    mediator.promise('sync:notification:' + self.datasetId, {predicate: function(notification) {
      return notification.code == 'local_update_applied'
        && notification.message == 'update'
        && notification.uid == object.id || object._localuid;
    }})
    .then(function(notification) {
      return self.read(notification.uid);
    })
    .then(function(result) {
      deferred.resolve(result);
    })
  }, function(code, msg) {
    // failure
    deferred.reject(new Error(formatError(code, msg)));
  });
  return deferred.promise;
};

DataManager.prototype.delete = function(object) {
  var deferred = q.defer();
  var self = this;
  $fh.sync.doDelete(self.datasetId, object.id, function(res) {
    // success
    mediator.promise('sync:notification:' + self.datasetId, {predicate: function(notification) {
      return notification.code == 'local_update_applied'
        && notification.message == 'delete'
        && notification.uid == object.id;
    }})
    .then(function(notification) {
      deferred.resolve(notification.message);
    })
  }, function(code, msg) {
    // failure
    deferred.reject(new Error(formatError(code, msg)));
  });
  return deferred.promise;
};

DataManager.prototype.start = function() {
  var deferred = q.defer();
  $fh.sync.startSync(this.datasetId, function(){
    deferred.resolve('sync loop started');
  }, function(error){
    deferred.reject(new Error(formatError(code, msg)));
  });
  return deferred.promise;
};

DataManager.prototype.stop = function() {
  var deferred = q.defer();
  var self = this;
  $fh.sync.stopSync(this.datasetId, function(){
    deferred.resolve('sync loop stopped');
  }, function(error){
    deferred.reject(error);
  });
  return deferred.promise;
};

DataManager.prototype.forceSync = function() {
  var deferred = q.defer();
  $fh.sync.forceSync(this.datasetId, function(){
    deferred.resolve('sync loop will run');
  }, function(error){
    deferred.reject(error);
  });
  return deferred.promise;
};


module.exports = {
  init: init
, manage: manage
, addListener: addListener
}
