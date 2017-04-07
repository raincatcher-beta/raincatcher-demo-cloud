var store = require('raincatcher-mongoose-store');
// var SimpleStore = require('fh-wfm-simple-store')({persistent: config.get('persistentStore')});

// TODO move to mongoUtils
function _getMongoURI() {
  var isRHMAP = (process.env.FH_ENV && process.env.FH_MONGODB_CONN_URL);
  var platformURi = process.env.FH_MONGODB_CONN_URL;
  var localURi = 'mongodb://localhost:27017/raincatcher';
  return isRHMAP ? platformURi : localURi;
}

function connect() {
  return store.connect(_getMongoURI(), {});
}

function getCollectionDal(dataset) {
  // TODO promise to check if db is connected
  return store.getDAL(dataset);
}

module.exports = {
  connect: connect,
  getCollectionDal: getCollectionDal
};

// var DB = function() {};

// DB.prototype.isReady = function() {
//   return q.when(_ready);
// };

// DB.prototype.init = function() {
//   _getConnector(_getMongoURI(), {}).then(function(collections) {
//     _DB_CONNECTOR = collections;
//     _ready = true;
//   }, _handleError);
// };

// DB.prototype.getCollection = function(coll) {
//   var d = q.defer();
//   var collection = _DB_CONNECTOR[coll];
//   d.resolve(collection);
//   return d.promise;
// };

// DB.prototype.initSync = function(wfmSync, mediator, mbaasApi, syncOptions) {
//   //Initialising the fh-wfm-sync data sets for each module
//   wfmSync.init(mediator, mbaasApi, 'workorders', syncOptions);
//   wfmSync.init(mediator, mbaasApi, 'result', syncOptions);
//   wfmSync.init(mediator, mbaasApi, 'workflows', syncOptions);
// };

// var db = new DB();
// db.init();
// module.exports = db;

// function _getCollection(coll) {
//   return new Promise(function(resolve) {
//     var collection = _DB_CONNECTOR[coll];
//     return resolve(collection);
//   });
// }

// function _getCollection(coll, cb) {
//   var collection = _DB_CONNECTOR[coll];
//   cb(collection);
// }

// function _init() {
//   var opts = {};
//   var URI = _getMongoURI();
//   return new Promise(function(resolve, reject) {
//     _getConnector(URI, opts).then(function(collections) {
//       if (collections) {
//         _DB_CONNECTOR = collections;
//         eventEmitter.emit('dbconnection');

//         resolve(true);
//       } else {
//         resolve(false);
//       }
//     }, function(err) {
//       console.error(err);
//       reject(false);
//     });
//   });
// }
//   _getConnector(_getMongoURI(), {}, function(err, collections) {
//     if (err) {
//       _ready = false;
//       throw new Error('Error retrieving all mongo collections');
//     } else {
//       _DB_CONNECTOR = collections;
//       _ready = true;
//     }
//   });
// }

// function _isReady() {
//   return new Promise(function(resolve) {
//     // console.log('_isReady', _ready)
//     // if (_ready) {
//       console.log('db.js: db is ready', _ready);
//       resolve(_ready);
//     // }
//     // resolve(_ready);
//   });
// }


// db.init().then(function(hasConnection) {
//   return _ready = hasConnection;
// }, function(err) {
//   throw new Error('EPOD-Mongo-Connector: unable to connection to mongo');
// });




// module.exports = {
//   init: _init,
//   isReady: _isReady,
//   getCollection: _getCollection,
//   events: eventEmitter
// };