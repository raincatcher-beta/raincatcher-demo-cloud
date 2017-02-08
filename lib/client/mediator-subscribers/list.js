var CONSTANTS = require('../../constants');


/**
 *
 * Creating a subscriber to the list topic for a single data set.
 *
 * @param {Mediator} syncDatasetTopics         - The sync topic subscribers for a data set.
 * @param {DataManager} datasetManager   - The individual data set manager. This is where the business logic exists for
 * @returns {Subscription} - The subscription for the list topic
 */
module.exports = function subscribeToListTopic(syncDatasetTopics, datasetManager) {

  /**
   * Handling the list topic for this dataset.
   *
   * @param parameters
   * @param parameters.topicUid  - (Optional)  A unique ID to be used to publish completion / error topics.
   */
  return function handleListTopic(parameters) {
    var self = this;
    parameters = parameters || {};

    //Creating the item in the sync store
    datasetManager.list().then(function(arrayOfDatasetItems) {
      var listDoneTopic = syncDatasetTopics.getTopic(CONSTANTS.TOPICS.LIST, CONSTANTS.DONE_PREFIX, parameters.topicUid);

      self.mediator.publish(listDoneTopic, arrayOfDatasetItems);

    }).catch(function(error) {

      var listErrorTopic = syncDatasetTopics.getTopic(CONSTANTS.TOPICS.LIST, CONSTANTS.ERROR_PREFIX, parameters.topicUid);

      self.mediator.publish(listErrorTopic, error);
    });
  };

};