var CONSTANTS = require('../../constants');


/**
 *
 * Creating a subscriber to the force_sync topic for a single data set.
 *
 * @param {Mediator} syncDatasetTopics         -  The sync topic subscribers for a data set.
 * @param {DataManager} datasetManager   - The individual data set manager. This is where the business logic exists for
 * @returns {Subscription} - The subscription for the force_sync topic
 */
module.exports = function subscribeToForceSyncTopic(syncDatasetTopics, datasetManager) {


  /**
   * Handling the force_sync topic for this dataset.
   *
   * @param {object} parameters
   * @param {string/number} parameters.topicUid  - (Optional)  A unique ID to be used to publish completion / error topics.
   */
  return function handleForceSync(parameters) {
    var self = this;
    parameters = parameters || {};

    //Creating the item in the sync store
    datasetManager.forceSync().then(function() {
      var forceSyncDoneTopic = syncDatasetTopics.getTopic(CONSTANTS.TOPICS.FORCE_SYNC, CONSTANTS.DONE_PREFIX, parameters.topicUid);
      self.mediator.publish(forceSyncDoneTopic);

    }).catch(function(error) {
      var forceSyncErrorTopic = syncDatasetTopics.getTopic(CONSTANTS.TOPICS.FORCE_SYNC, CONSTANTS.ERROR_PREFIX, parameters.topicUid);
      self.mediator.publish(forceSyncErrorTopic, error);
    });
  };
};