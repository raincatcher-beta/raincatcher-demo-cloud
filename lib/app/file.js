'use strict';

var store = require('../storage/storage-init');
var q = require('q');
var mongoUtil = require("../storage/mongoUtil");

module.exports = function(mediator, app) {

  var deferred = q.defer();
  mongoUtil.getMongoURL(function(err, url) {
    if (err || !url) {
      console.log("Cannot determine valid mongodb connection url. Using temporary file storage");
      require('fh-wfm-file/lib/cloud')(mediator, app, {});
    } else {
      var storageConfig = {
        gridFs: {
          mongoUrl: url
        }
      };
      console.log("Using gridfs file storage", url);
      require('fh-wfm-file/lib/cloud')(mediator, app, storageConfig);
    }
    store.init('file', null, mediator).then(deferred.resolve).catch(deferred.reject);
  });

  return deferred.promise;
};
