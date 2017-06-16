'use strict';

var initMockData = require('../storage/initMockData');
var sheetStore = require('raincatcher-google-sheet-store');
var workorders = require('../mockData/workorders');
var config = require('../config');
var dataTopicPrefix = config.get('dataTopicPrefix');

module.exports = function(mediator) {
  // Rebase the workorder dates to today. This is used for demo purposes.
  var today = new Date();
  var tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  workorders.forEach(function(workorder, index) {
    var date = new Date(workorder.startTimestamp);
    var hours = date.getHours();
    var newDate = index < workorders.length *2 / 3 ? today : tomorrow;
    newDate.setHours(hours);
    workorder.startTimestamp = newDate.toString();
    workorder.finishTimestamp = tomorrow.toString();
  });

  var workorderSheetStore = new sheetStore.GoogleSheetStore('workorders', config.get('sheetStoreConfig').sheetIds.workorders, {
    fields: {
      //Common fields don't need any data conversion
      common: ["id", "title", "workflowId", "assignee", "address", "finishTimestamp", "startTimestamp", "status", "summary", "type"],
      json: {
        location: {
          sheetFields: [{
            path: 'lat',
            convert: function(val) {
              return parseFloat(val);
            }
          }, {
            path: 'long',
            convert: function(val) {
              return parseFloat(val);
            }
          }]
        }
      },
      sheet: {
        lat: {
          path: 'location[0]'
        },
        long: {
          path: 'location[1]'
        }
      }
    }
  });

  return initMockData(workorderSheetStore, workorders).then(function() {

    //Allowing the mongoose store to subscribe to any topics
    //related to the `workorders` data set` (e.g. wfm:cloud:data:workorders:create )
    return workorderSheetStore.listen(config.get('topicPrefix') + dataTopicPrefix, mediator);
  });
};
