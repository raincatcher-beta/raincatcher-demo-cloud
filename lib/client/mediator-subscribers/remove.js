var CONSTANTS = require('../../constants');


/**
 *
 * Creating a subscriber to the remove topic for a single data set.
 *
 * @param {Mediator} syncDatasetTopics         - The sync topic subscribers for a data set.
 * @param {DataManager} datasetManager   - The individual data set manager. This is where the business logic exists for
 * @returns {Subscription} - The subscription for the remove topic
 */
module.exports = function subscribeToRemoveTopic(syncDatasetTopics, datasetManager) {

  /**
   * Handling the remove topic for this dataset.
   *
   * @param parameters
   * @param parameters.topicUid  - (Optional)  A unique ID to be used to publish completion / error topics.
   * @param parameters.id        - The ID of the item to read
   */
  return function handleRemoveTopic(parameters) {
    var self = this;
    parameters = parameters || {};

    datasetManager.delete({id: parameters.id}).then(function() {
      var removeDoneTopic = syncDatasetTopics.getTopic(CONSTANTS.TOPICS.REMOVE, CONSTANTS.DONE_PREFIX, parameters.topicUid);

      self.mediator.publish(removeDoneTopic);

    }).catch(function(error) {

      var removeErrorTopic = syncDatasetTopics.getTopic(CONSTANTS.TOPICS.REMOVE, CONSTANTS.ERROR_PREFIX, parameters.topicUid);

      self.mediator.publish(removeErrorTopic, error);
    });
  };
};