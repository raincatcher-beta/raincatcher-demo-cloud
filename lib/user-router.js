'use strict';

var express = require('express'),
    config = {
      apiPath: '/api/wfm/user'
    };

//This is probably not needed anymore after using sync service
function initRouter(mediator) {
  var router = express.Router();

  router.route('/').get(function(req, res, next) {
    mediator.once('done:user:list:load', function(data) {
      res.json(data);
    });
    mediator.publish('user:list:load');
  });
  router.route('/:id').get(function(req, res, next) {
    var userId = req.params.id
    mediator.once('done:user:load:' + userId, function(data) {
      res.json(data);
    });
    mediator.publish('user:load', userId);
  });
  router.route('/:id').put(function(req, res, next) {
    var userId = req.params.id;
    var user = req.body;
    // console.log('req.body', req.body);
    mediator.once('done:user:save:' + userId, function(saveduser) {
      res.json(saveduser);
    });
    mediator.publish('user:save', user);
  });
  router.route('/').post(function(req, res, next) {
    var ts = new Date().getTime();  // TODO: replace this with a proper uniqe (eg. a cuid)
    var user = req.body;
    user.createdTs = ts;
    mediator.once('done:user:create:' + ts, function(createduser) {
      res.json(createduser);
    });
    mediator.publish('user:create', user);
  })

  return router;
};

module.exports = function(mediator, app) {
  var router = initRouter(mediator);
  app.use(config.apiPath, router);
}
