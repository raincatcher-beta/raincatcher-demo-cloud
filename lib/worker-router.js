'use strict';

var express = require('express'),
    config = {
      apiPath: '/api/wfm/worker'
    };

//This is probably not needed anymore after using sync service
function initRouter(mediator) {
  var router = express.Router();

  router.route('/').get(function(req, res, next) {
    mediator.once('done:worker:list:load', function(data) {
      res.json(data);
    });
    mediator.publish('worker:list:load');
  });
  router.route('/:id').get(function(req, res, next) {
    var workerId = req.params.id
    mediator.once('done:worker:load:' + workerId, function(data) {
      res.json(data);
    });
    mediator.publish('worker:load', workerId);
  });
  router.route('/:id').put(function(req, res, next) {
    var workerId = req.params.id;
    var worker = req.body;
    // console.log('req.body', req.body);
    mediator.once('done:worker:save:' + workerId, function(savedworker) {
      res.json(savedworker);
    });
    mediator.publish('worker:save', worker);
  });
  router.route('/').post(function(req, res, next) {
    var ts = new Date().getTime();  // TODO: replace this with a proper uniqe (eg. a cuid)
    var worker = req.body;
    worker.createdTs = ts;
    mediator.once('done:worker:create:' + ts, function(createdworker) {
      res.json(createdworker);
    });
    mediator.publish('worker:create', worker);
  })

  return router;
};

module.exports = function(mediator, app) {
  var router = initRouter(mediator);
  app.use(config.apiPath, router);
}
