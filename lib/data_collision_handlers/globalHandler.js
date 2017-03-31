
/**
 * this is optional custom collision handler example.
 * Refer to the documentation
 * https://access.redhat.com/documentation/en-us/red_hat_mobile_application_platform_hosted/3/html/cloud_api/fh-sync#fh-sync-handlecollision
 */
// TODO: Change this function to your own custom collision handler
module.exports = function(dataset_id, hash, timestamp, uid, pre, post, meta_data) {
  console.log('./lib/data_collision_handlers/globalHandler.js');
  console.log('**********************************');
  console.log('***  CUSTOM COLLISION HANDLER  ***');
  console.log('***    detected a collision    ***');
  console.log('dataset_id', dataset_id);
  console.log('hash', hash);
  console.log('timestamp', timestamp);
  console.log('uid', uid);
  console.log('pre', pre);
  console.log('post', post);
  console.log('meta_data', meta_data);
  console.log('***********************************');
};

