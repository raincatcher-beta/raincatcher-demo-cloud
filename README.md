# FeedHenry WFM sync

A sync module for FeedHenry WFM providing :
- A Server-side sync module
- A Front-end (Angular Service) sync module

## Client-side usage

### Client-side usage (via broswerify)

#### Setup

This module is packaged in a CommonJS format, exporting the name of the Angular namespace.  The module can be included in an angular.js as follows:

```javascript
angular.module('app', [
, require('fh-wfm-sync')
...
])
```
#### Integration

##### Angular service

The sync service must first be initialized using the `syncService.init()`. Generally, the syncService will be injected into another Angular service (or in a config block) :

```javascript

.factory('workorderSync', function($q, $timeout, syncService) {
  syncService.init($fh, config.syncOptions);
});

```  
Once initialized the syncService can manage a `dataset` :

```javascript

syncService.manage(config.datasetId, null, queryParams);

```

Checkout a full example [here](https://github.com/feedhenry-staff/wfm-workorder/blob/master/lib/angular/sync-service.js)


## Usage in an express backend

### Setup

The server-side component of this WFM module exports a function that takes express and mediator instances as parameters, as in:

```javascript


var _ = require('lodash')
  , sync = require('fh-wfm-sync/lib/server')
  , config = require('./config')


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
