
var DEFAULT_ITEM_LIST = require('./default_item_type_list');
var Promise = require('bluebird');
var CLOUD_TOPIC_PREFIX  = require('./topics_constants').CLOUD_TOPIC_PREFIX;
/**
 * Removes all data in the solution
 * @param {Object} mediator - mediator object used for communication
 * @returns {Promise} Promise, resolved if all data-reset are successfully removed.
 */
function removeData(mediator) {

  function getRemoveAllForType(item) {
    return removeAllItemsForType(mediator, item);
  }

  // Process all synchronously, return empty value at the end as we ignore the result
  return Promise.mapSeries(DEFAULT_ITEM_LIST, getRemoveAllForType).return();
}


/**
 * Removes all items of a type - gets list of items based on their type name and removes synchronously one-by-one
 * @param {Object} mediator - mediator object used for communication
 * @param {String} itemType - type of the item to remove e.g. result, workorder
 * @returns {Promise} Promise, resolved if all items are successfully removed.
 */
function removeAllItemsForType(mediator, itemType) {
  var topic = CLOUD_TOPIC_PREFIX + itemType + ':list';

  //get list of item type
  return mediator.request(topic)
    .then(function(list) {
      return removeAllItemsFromList(mediator, list, itemType);
    });
}


/**
 * synchronously publishes mediator remove topic for each item on the list
 * @param {Object} mediator  - mediator object used for communication
 * @param {Array} list - list of the items to be removed
 * @param {String} itemType - type of the item to remove e.g. result, workorder
 * @returns {Promise}
 */
function removeAllItemsFromList(mediator, list, itemType) {
  var topic = CLOUD_TOPIC_PREFIX + itemType + ':delete';

  function removeSingle(item) {
    return mediator.request(topic, item.id, {uid: item.id});
  }

  return Promise.mapSeries(list, removeSingle).return();
}


module.exports = {
  removeData: removeData,
  removeAllItemsForType: removeAllItemsForType,
  removeAllItemsFromList: removeAllItemsFromList
};