var _ = require('lodash');
var CONSTANTS = require('../../constants');

var MediatorTopicUtility = require('fh-wfm-mediator/lib/topics');

var topicHandlers = {
  create: require('./create'),
  update: require('./update'),
  list: require('./list'),
  read: require('./read'),
  remove: require('./remove'),
  force_sync: require('./force-sync'),
  start: require('./start'),
  stop: require('./stop')
};

var syncSubscribers = {};

module.exports = {
  /**
   * Initialisation of all the topics that this module is interested in.
   * @param {Mediator} mediator
   * @param {DataManager} datasetManager - The individual Data Manager for a data set.
   * @param {object}  options
   * @param {string}  options.datasetId  - The identifier for the data set
   * @returns {Topics|exports|module.exports|*}
   */
  init: function(mediator, datasetManager, options) {

    var datasetSyncSubscribers = syncSubscribers[options.datasetId];
    //If there is already a set of subscribers set up, then don't subscribe again.
    if (datasetSyncSubscribers) {
      return datasetSyncSubscribers;
    }

    datasetSyncSubscribers = syncSubscribers[options.datasetId] = new MediatorTopicUtility(mediator);
    datasetSyncSubscribers.prefix(CONSTANTS.SYNC_TOPIC_PREFIX).entity(options.datasetId);

    //Setting up subscribers to the workorder topics.
    _.each(CONSTANTS.TOPICS, function(topicName) {
      if (topicHandlers[topicName]) {
        datasetSyncSubscribers.on(topicName, topicHandlers[topicName](datasetSyncSubscribers, datasetManager));
      }
    });

    //For each remote error, publish a sync error topic
    //This can be subscribed to by other modules. (Generally the module that created the manager)
    datasetManager.stream.forEach(function(notification) {
      var code = notification.code;
      datasetSyncSubscribers.mediator.publish(datasetSyncSubscribers.getTopic(code), notification);
    });

    return datasetSyncSubscribers;
  },
  /**
   * Removing any subscribers for a specific data set
   * @param {string} datasetId - The identifier for the data set.
   */
  tearDown: function(datasetId) {
    if (syncSubscribers && datasetId && syncSubscribers[datasetId]) {
      syncSubscribers[datasetId].unsubscribeAll();
      delete syncSubscribers[datasetId];
    }
  }
};