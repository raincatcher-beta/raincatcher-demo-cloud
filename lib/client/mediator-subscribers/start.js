var CONSTANTS = require('../../constants');



/**
 *
 * Creating a subscriber to the start topic for a single data set.
 *
 * @param {Mediator} syncDatasetTopics         - The mediator used for subscriptions.
 * @param {DataManager} datasetManager   - The individual data set manager. This is where the business logic exists for
 * @returns {Subscription} - The subscription for the start topic
 */
module.exports = function subscribeToStartSyncTopic(syncDatasetTopics, datasetManager) {

  /**
   * Handling the start topic for this dataset.
   *
   * @param parameters
   * @param parameters.topicUid  - (Optional)  A unique ID to be used to publish completion / error topics.
   */
  return function handleStartTopic(parameters) {
    var self = this;
    parameters = parameters || {};

    datasetManager.start().then(function() {
      var startDatasetSyncTopic = syncDatasetTopics.getTopic(CONSTANTS.TOPICS.START, CONSTANTS.DONE_PREFIX, parameters.topicUid);

      self.mediator.publish(startDatasetSyncTopic);

    }).catch(function(error) {

      var startDatasetSyncTopic = syncDatasetTopics.getTopic(CONSTANTS.TOPICS.START, CONSTANTS.ERROR_PREFIX, parameters.topicUid);

      self.mediator.publish(startDatasetSyncTopic, error);
    });
  };
};