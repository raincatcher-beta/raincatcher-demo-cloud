'use strict';

module.exports = 'wfm.workorder';

angular.module('wfm.workorder', [
  'wfm.core.mediator'
, require('./ng-modules/directives')
, require('./ng-modules/sync-service')
])
.run(function($timeout, mediator, workorderSync) {
  mediator.subscribe('workorder:load', function(data, ts) {
    workorderSync.read(data).then(function(workorder) {
      mediator.publish('done:workorder:load:' + workorder.id, workorder);
    }, function(error) {
      console.error(error);
    })
  });
  mediator.subscribe('workorders:load', function() {
    workorderSync.list().then(function(workorders) {
      mediator.publish('done:workorders:load', workorders);
    }, function(error) {
      console.error(error);
    })
  });
  mediator.subscribe('workorder:save', function(data) {
    workorderSync.update(data).then(function(syncResult) {
      mediator.publish('done:workorder:save:' + syncResult.uid, syncResult); // TODO: unwrap the sync result, extracting the workorder
    }, function(error) {
      console.error(error);
    })
  });
  mediator.subscribe('workorder:create', function(data) {
    workorderSync.create(data).then(function(workorder) {
      mediator.publish('done:workorder:create', workorder);
    }, function(error) {
      console.error(error);
    })
  });
  mediator.subscribe('workorder:new', function(data) {
    $timeout(function() {
      var workorder = {
        type: 'Job Order'
      , status: 'New'
      };
      mediator.publish('done:workorder:new', workorder);
    })
  });
})
;
