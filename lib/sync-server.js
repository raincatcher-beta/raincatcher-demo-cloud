'use strict';

var defaultConfig = require('./default-config')
  , q = require('q')
  ;

function initSync(mediator, mbaasApi, datasetId, syncOptions){
  syncOptions = syncOptions || defaultConfig.syncOptions;

  var dataListHandler = function(datasetId, queryParams, cb, metaData){
    mediator.publish('sync:'+datasetId+':list:load', queryParams);
    return mediator.promise('done:sync:'+datasetId+':list:load').then(function(data) {
      var syncData = {};
      data.forEach(function(object) {
        syncData[object.id] = object;
      });
      return cb(null, syncData);
    });
  };

  var dataCreateHandler = function(datasetId, data, cb, meta_data) {
    var ts = new Date().getTime();  // TODO: replace this with a proper uniqe (eg. a cuid)
    mediator.publish('sync:'+datasetId+':create', data, ts);
    return mediator.promise('done:sync:'+datasetId+':create:' + ts).then(function(object) {
      var res = {
        "uid" : object.id,
        "data" : object
      }
      return cb(null, res);
    });
  };

  var dataSaveHandler = function(datasetId, uid, data, cb, meta_data) {
    mediator.publish('sync:'+datasetId+':save', data);
    return mediator.promise('done:sync:'+datasetId+':save:' + uid).then(function(object) {
      return cb(null, object);
    });
  };

  var dataGetHandler = function(datasetId, uid, cb, meta_data) {
    mediator.publish('sync:'+datasetId+':load', uid);
    return mediator.promise('done:sync:'+datasetId+':load:' + uid).then(function(object) {
      return cb(null, object);
    });
  };

  var dataDeleteHandler = function(datasetId, uid, cb, meta_data) {
    mediator.publish('sync:'+datasetId+':delete', uid);
    return mediator.promise('done:sync:'+datasetId+':delete:' + uid).then(function(message) {
      return cb(null, message);
    });
  };

  //start the sync service
  var deferred = q.defer();
  mbaasApi.sync.init(datasetId, syncOptions, function(err) {
    if (err) {
      deferred.reject(err);
      console.error(err);
    } else {
      mbaasApi.sync.handleList(datasetId, dataListHandler);
      mbaasApi.sync.handleCreate(datasetId, dataCreateHandler);
      mbaasApi.sync.handleUpdate(datasetId, dataSaveHandler);
      mbaasApi.sync.handleRead(datasetId, dataGetHandler);
      mbaasApi.sync.handleDelete(datasetId, dataDeleteHandler);
      deferred.resolve(datasetId);
    }
  });
  return deferred.promise;
}

function stop(mbaasApi, datasetId) {
  var deferred = q.defer();
  mbaasApi.sync.stop(datasetId, function() {
    deferred.resolve(datasetId);
  });
  return deferred.promise;
}

module.exports = {
  init: initSync
, stop: stop
};
