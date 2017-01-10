'use strict';
var express = require('express');

module.exports = function(serviceGuid, mbaasApi) {
  var router = express.Router();
  router.route('/data').delete(function(req, res) {
    mbaasApi.service({
      guid: serviceGuid,
      path: '/admin/data',
      method: 'DELETE'
    }, function(err, data, response) {
      if (err) {
        return res.status(response.status).send(err);
      }
      res.status(200).end();
    });
  });
  return router;
};
