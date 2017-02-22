var CONSTANTS = require('../../constants');


/**
 *
 * Creating a subscriber to the create topic for a single data set.
 *
 * @param {object} syncDatasetTopics       - The sync topic subscribers for a data set.
 * @param {DataManager} datasetManager   - The individual data set manager. This is where the business logic exists for
 * @returns {Subscription} - The subscription for the create topic
 */
module.exports = function subscribeToCreateTopic(syncDatasetTopics, datasetManager) {


  /**
   *
   * Handler for the data sync create topic for this dataset.
   *
   * @param {object} parameters
   * @param {string/number} parameters.topicUid     - (Optional)  A unique ID to be used to publish completion / error topics.
   * @param {object} parameters.itemToCreate - The item to create.
   */
  return function handleCreateTopic(parameters) {
    var self = this;
    parameters = parameters || {};
    var datasetItemToCreate = parameters.itemToCreate;

    //Creating a data item for this dataset.
    datasetManager.create(datasetItemToCreate).then(function(createdDatasetItem) {

      //Item created successfully, publishing the success topic.
      var creatDoneTopic = syncDatasetTopics.getTopic(CONSTANTS.TOPICS.CREATE, CONSTANTS.DONE_PREFIX, parameters.topicUid);

      self.mediator.publish(creatDoneTopic, createdDatasetItem);

    }).catch(function(error) {

      //An error occurred while trying to create a new item, publishing the error topic.
      var errorCreateTopic = syncDatasetTopics.getTopic(CONSTANTS.TOPICS.CREATE, CONSTANTS.ERROR_PREFIX, parameters.topicUid);

      self.mediator.publish(errorCreateTopic, error);
    });
  };
};