var express = require('express');
var bodyParser = require('body-parser');
var getResetDataFn = require('./data-reset');
var HttpStatus = require('http-status-codes');

/**
 * Builds and returns resetDataHandler.
 * @param {Object} mediator - mediator object used for communication
 * @returns {Function} resetDataHandler.
 */
function getResetDataHandler(mediator) {
  var resetDataFunction  = getResetDataFn(mediator);

  /**
   * Runs data reset
   */
  return function resetDataHandler(req, res) {
    resetDataFunction()
      .then(function() {
        res.status(HttpStatus.NO_CONTENT).end();
      })
      .catch(function(err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
      });
  };
}


module.exports = function(mediator) {
  var router = express.Router();
  router.use(bodyParser());
  router.delete('/data', getResetDataHandler(mediator));

  return router;
};
