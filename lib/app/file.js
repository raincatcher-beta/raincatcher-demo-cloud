'use strict';

var store = require('../store-init.js');
var q = require('q');
var mongoUtil = require("../app/mongoUtil");

module.exports = function(mediator, app) {

  var deferred = q.defer();

  mongoUtil.getMongoURL(function(err, url) {
    if (err || !url) {
      console.log("Cannot determine valid mongodb connection url. Using temporary file storage");
      require('fh-wfm-file/lib/cloud')(mediator, app, {usePersistentStorage: false});
    } else {
      var storageConfig = {
        gridFs: {
          mongoUrl: url
        }
      };
      console.log("Using Mongo URL: ", url);
      require('fh-wfm-file-storage/lib/cloud')(mediator, storageConfig);
      require('fh-wfm-file/lib/cloud')(mediator, app, {usePersistentStorage: true});
    }

    store.init('file', null, mediator).then(deferred.resolve).catch(deferred.reject);
  });

  return deferred.promise;
};
