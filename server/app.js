'use strict';

var express = require('express')
  , app = express()
  , config = require('./config')
  , middle = require('./middleware')
  , router = express.Router()
  ;

app.set('port', config.get('PORT'));
app.set('base url', config.get('IP'));
app.use(middle.cors);

app.use(express.static(__dirname + '/../portal'));
app.use('/node_modules', express.static(__dirname + '/../node_modules'));
app.use('/api', router);
app.use(middle.logError);
app.use(middle.handleError);

module.exports = exports = app;
