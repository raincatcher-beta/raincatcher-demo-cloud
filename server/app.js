'use strict';

var express = require('express')
  , app = express()
  , config = require('./config')
  , middle = require('./middleware')
  , mediator = require('wfm-mediator/mediator')
  ;

app.set('port', config.get('PORT'));
app.set('base url', config.get('IP'));
app.use(middle.cors);

app.use(express.static(__dirname + '/../portal'));
app.use('/node_modules', express.static(__dirname + '/../node_modules'));

// app specific router
var router = express.Router();
router.get('/hello', function (req, res, next) {
  res.send('hello');
});
app.use('/api', router);

// setup the wfm routes
require('wfm-workorder/router')(mediator, app);

// error handling
app.use(middle.logError);
app.use(middle.handleError);

// app modules
require('./app/workorder')(mediator);

module.exports = exports = app;
