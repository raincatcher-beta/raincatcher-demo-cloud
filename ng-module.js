'use strict';

var angular = require('angular');

angular.module('wfm.core.sync', ['wfm.core.mediator','ng'])

.factory('sync', function syncService(mediator) {
   
  $fh.sync.init( {
    "sync_frequency" : 5,
    "storage_strategy": "dom",
    "do_console_log": true
  });	
  
  $fh.sync.notify(function(notification) {
    mediator.publish("wfm:sync:" + notification.dataset_id, notification);	
  });

  return {
  	transformDataSet : function(syncData) {
  	  var normalizedData = [];
      for (var key in syncData) {
        //putting the array of workorders in the original format again
        var tempObj = {};
        tempObj = syncData[key].data;
        normalizedData.push(tempObj);
      }
      return normalizedData;
  	},
  	getSync : function(){
  	  return $fh.sync;	
  	}
  }
});

module.exports = 'wfm.core.sync';
