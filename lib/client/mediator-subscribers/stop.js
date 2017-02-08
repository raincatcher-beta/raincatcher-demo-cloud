var CONSTANTS = require('../../constants');


/**
 *
 * Creating a subscriber to the stop topic for a single data set.
 *
 * @param {Mediator} syncDatasetTopics         - The mediator used for subscriptions.
 * @param {DataManager} datasetManager   - The individual data set manager. This is where the business logic exists for
 * @returns {Subscription} - The subscription for the stop topic
 */
module.exports = function subscribeToStartSyncTopic(syncDatasetTopics, datasetManager) {

  /**
   * Handling the stop topic for this dataset.
   *
   * @param parameters
   * @param parameters.topicUid  - (Optional)  A unique ID to be used to publish completion / error topics.
   */
  return function handleStopTopic(parameters) {
    var self = this;
    parameters = parameters || {};

    datasetManager.stop().then(function() {
      var stopDatasetSyncTopic = syncDatasetTopics.getTopic(CONSTANTS.TOPICS.STOP, CONSTANTS.DONE_PREFIX, parameters.topicUid);

      self.mediator.publish(stopDatasetSyncTopic);

    }).catch(function(error) {

      var stopDatasetSyncTopic = syncDatasetTopics.getTopic(CONSTANTS.TOPICS.STOP, CONSTANTS.ERROR_PREFIX, parameters.topicUid);

      self.mediator.publish(stopDatasetSyncTopic, error);
    });
  };
};