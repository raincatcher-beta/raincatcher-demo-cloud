var Promise = require('bluebird');
var $fh = require('fh-mbaas-api');

var authServiceGuid = process.env.WFM_AUTH_GUID;

/**
 * Calls auth service to reset all users back to sample data set:
 * https://github.com/feedhenry-raincatcher/raincatcher-demo-auth/blob/master/lib/data.json
 * Returns promise
 */
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
        fromCallbackCb(new Error(err));
      } else if (res && res.statusCode && res.statusCode > 204) {
        fromCallbackCb(res);
      } else {
        fromCallbackCb();
      }
    });
  });

};