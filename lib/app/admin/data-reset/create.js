
var relationsMapper = require('./map_relations');
var Promise = require('bluebird');

var DEFAULT_LIST_RELATIONS = require('./default_list_relations');
var DEFAULT_ITEM_LIST = require('./default_item_type_list');
var SAMPLE_DATA = require('./data-demo');
var CLOUD_TOPIC_PREFIX  = require('./topics_constants').CLOUD_TOPIC_PREFIX;


/**
 * Returns build data function singleton
 * @param {Object} mediator - mediator object used for communication
 * @returns {Function} - buildData function
 */
function getBuildDataFunction(mediator) {
  /**
   * Synchronously publishes 'wfm:cloud:{itemType}:create topic for each item type.
   * @param {Object} mediator  - mediator object used for communication
   * @returns {Promise} Promise, resolved if all items are successfully created.
   */
  return function buildData() {
    var relationsMap = [];

    /**
     * Iterator function for mapSeries, creates all sample items for given item type
     * @param itemType
     * @returns {Promise}
     */
    function createDataForType(itemType) {
      return createItemsForType(mediator, itemType, relationsMap)
        .then(function(mappingsForType) {
          relationsMap[itemType] = mappingsForType;
        });
    }

    return Promise.mapSeries(DEFAULT_ITEM_LIST, createDataForType).return();
  };
}


/**
 * Creates all items of a given type
 * @param {Object} mediator  - mediator object used for communication
 * @param {String} itemType - type of the item to remove e.g. result, workorder
 * @param {Array} relationsMap - An array mapping out relations between seed and newly created data-reset
 * @returns {Promise} with mappings for given type.
 */
function createItemsForType(mediator, itemType, relationsMap) {
  var topic = CLOUD_TOPIC_PREFIX + itemType + ':create';


  function createForType(dataItem) {
    var mapping = {
      seedId: dataItem.id,
      newId: ''
    };
    dataItem = relationsMapper.mapRelations(itemType, dataItem, relationsMap[DEFAULT_LIST_RELATIONS[itemType]]);

    return mediator.request(topic, [dataItem, dataItem.id], {uid: dataItem.id})
      .then(function(createdItem) {
        mapping.newId = createdItem.id;
        return mapping;
      });
  }
  //map series resolves to an array of results returned by its iterator func. i.e. an array of mappings for a type
  return Promise.mapSeries(SAMPLE_DATA[itemType](), createForType);
}


module.exports = {
  getBuildDataFunction: getBuildDataFunction,
  createItemsForType: createItemsForType
};
