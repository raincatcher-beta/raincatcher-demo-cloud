
var relationsMapper = require('./map_relations');
var Promise = require('bluebird');

var DEFAULT_LIST_RELATIONS = require('./default_list_relations');
var DEFAULT_ITEM_LIST = require('./default_item_type_list');
var SAMPLE_DATA = require('./data-demo');


function getBuildDataFunction(mediator) {
  /**
   * Builds data-reset using seed data-reset located in ./data-reset-demo, synchronously publishes 'wfm:cloud:{itemType}:create topic for each item.
   * @param {Object} mediator  - mediator object used for communication
   * @returns {Promise} Promise, resolved if all items are successfully created.
   */
  return function buildData() {
    var relationsMap = [];

    function getCreateItemsForType(itemType) {
      return createItemsForType(mediator, itemType, relationsMap)
        .then(function(mappingsForType) {
          relationsMap[itemType] = mappingsForType;
        });
    }

    return Promise.mapSeries(DEFAULT_ITEM_LIST, getCreateItemsForType).return();
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
  var topic = 'wfm:cloud:' + itemType + ':create';

  var mappingsForType = [];

  function createForType(dataItem) {
    var mapping = {
      seedId: dataItem.id,
      newId: ''
    };
    dataItem = relationsMapper.mapRelations(itemType, dataItem, relationsMap[DEFAULT_LIST_RELATIONS[itemType]]);

    return mediator.request(topic, [dataItem, dataItem.id], {uid: dataItem.id})
      .then(function(createdItem) {
        mapping.newId = createdItem.id;
        mappingsForType.push(mapping);
      });
  }

  return Promise.mapSeries(SAMPLE_DATA[itemType](), createForType)
    .then(function() {
      return mappingsForType;
    });
}


module.exports = {
  getBuildDataFunction: getBuildDataFunction,
  createItemsForType: createItemsForType
};
