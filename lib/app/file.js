'use strict';

var mongooseStore = require('fh-wfm-mongoose-store');
var mongoUtil = require("../storage/mongoUtil");
var config = require('../config');
var dataTopicPrefix = config.get('dataTopicPrefix');

module.exports = function(mediator, app) {

  return mongoUtil.getMongoURL().then(function(url) {
    var storageConfig = {
      gridFs: {
        mongoUrl: url
      }
    };
    console.log("Using gridfs file storage", url);
    require('fh-wfm-file/lib/cloud')(mediator, app, storageConfig);
    return mongooseStore.getDAL('file').then(function(fileMongooseStore) {
      return fileMongooseStore.init(null).then(function() {
        return fileMongooseStore.listen(dataTopicPrefix, mediator);
      });
    });
  }).catch(function() {
    console.log("Cannot determine valid mongodb connection url. Using temporary file storage");
    require('fh-wfm-file/lib/cloud')(mediator, app, {});
  });
};
