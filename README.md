# FeedHenry WFM sync

A sync module for FeedHenry WFM providing :
- A Server-side sync module
- A Front-end (Angular Service) sync module

This module makes uses the [$fh.sync Client](https://access.redhat.com/documentation/en/red-hat-mobile-application-platform-hosted/3/paged/client-api/chapter-11-fhsync) and [$fh.sync Cloud](https://access.redhat.com/documentation/en/red-hat-mobile-application-platform-hosted/3/paged/cloud-api/chapter-10-fhsync) APIs to provide the data synchronisation functionality.

## Client-side usage

### Client-side usage (via broswerify)

#### Setup

This module is packaged in a CommonJS format, exporting the name of the Angular namespace.  The module can be included in an angular.js as follows:

```javascript
angular.module('app', [require('fh-wfm-sync')], function(sync){
// ...
});
```
#### Integration

##### Angular service

The sync service must first be initialized using the `syncService.init()`. Generally, the syncService will be injected into another Angular service (or in a config block) :

```javascript

.factory('workorderSync', function($q, $timeout, syncService) {
  syncService.init($fh, config.syncOptions);
});
```

Once initialized the syncService can manage multiple `dataset` using the following function:

```javascript

syncService.manage(config.datasetId, null, queryParams);

```

Checkout a full example [here](https://github.com/feedhenry-staff/wfm-workorder/blob/master/lib/angular/sync-service.js)


#### Topics

The following topics are published by the client side of the application:

##### Data Set Topics

The following topics are published by the module for each `dataset`. If the 

###### $fh.sync Client Notifications

The module publishes topics covering all of the notification codes available to the $fh.sync Client API.

wfm:sync:**sync_notification_code**:**datasetId**

The list of notification codes published are:

* client_storage_failed: Loading or saving to client storage failed. This is a critical error and the Sync Client will not work properly without client storage.
* sync_started: A synchronization cycle with the server has been started.
* sync_complete: A synchronization cycle with the server has been completed.
* offline_update: An attempt was made to update or delete a record while offline.
* collision_detected: Update failed due to data collision.
* remote_update_failed: Update failed for a reason other than data collision.
* remote_update_applied: An update was applied to the remote data store.
* local_update_applied: An update was applied to the local data store.
* delta_received: A change was received from the remote data store for the dataset. It is best to listen to this notification and update the UI accordingly.
* record_delta_received: A delta was received from the remote data store for the record. It is best to listen to this notification and update UI accordingly.
* sync_failed: Synchronization loop failed to complete.

Each of these topics will be published with an object describing the event:

```javascript
{
  //The dataset that the notification is associated with
  dataset_id: "workorders",
  // The unique identifier that the notification is associated with.
  // This will be the unique identifier for a record if the notification is related to an individual record,
  // or the current hash of the dataset if the notification is associated with a full dataset
  //  (for example, sync_complete)
  uid: "workorder1234",
  // Optional free text message with additional information
  message: "A remote update failed for this data set"
  // The notification message code (See above)
  code: "remote_update_failed"
}
```

## Usage in an express backend

### Setup

The server-side component of this WFM module exports a function that takes express and mediator instances as parameters, as in:

```javascript
var sync = require('fh-wfm-sync/lib/server');
var config = require('../config');

module.exports = function(mediator, app, mbaasApi) {
  sync.init(mediator, mbaasApi, config.datasetId, config.syncOptions);
};
```
#### Sync config options

Check a complete example [here](https://github.com/feedhenry-staff/wfm-workorder/blob/master/lib/config.js)

```javascript
{
  datasetId : 'workorders',
  syncOptions : {
    "sync_frequency" : 5,
    "storage_strategy": "dom",
    "do_console_log": false
  }
}
```
