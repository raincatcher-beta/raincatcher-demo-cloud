var Promise = require('bluebird');
var $fh = require('fh-mbaas-api');

var authServiceGuid = process.env.WFM_AUTH_GUID;

module.exports = function() {

  return Promise.fromCallback(function(fromCallbackCb) {
    $fh.service({
      guid: authServiceGuid,
      path: "/admin/data",
      method: "DELETE",
      timeout: 25000
    }, function(err, body, res) {
      //resolve manually. $fh.service returns error on internal (fh) or connection error.
      // we can check statusCode and body for service side errors - code !== 204
      if (err) {
        fromCallbackCb(err);
      } else if (res && res.statusCode !== 204) {
        fromCallbackCb(body);
      } else {
        fromCallbackCb();
      }
    });
  });

};