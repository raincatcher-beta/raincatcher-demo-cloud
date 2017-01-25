
var _ = require('lodash');


/**
 * Maps relations between objects, this is being used as mediator create topic creates new id and it needs to be mapped vs its seed object id
 * @param {String} type - type of the item e.g. result, workflow
 * @param {Object} dataItem - single item object e.g workorder, membership
 * @param {Array} mappings - an array of mappings objects, they consist of seedId - original id from files, and newId - id generated on create
 * @returns {Object} dataItem - dataItem object updated with newId of relevant mapping
 */
function mapRelations(type, dataItem, mappings) {
  switch (type) {
  case  'workorders':
    return mapWorkOrders(dataItem, mappings);
  case  'membership':
    return mapMemberships(dataItem, mappings);
  default:
    return dataItem;
  }
}

/**
 * Maps workorders by workflowId
 * @param {Object} dataItem - single workorder item object
 * @param {Array} mappings - an array of mappings objects for workflows
 * @returns {Object} dataItem - workorder dataItem object with workflowId property updated with newId of relevant mapping
 */
var mapWorkOrders = function(dataItem, mappings) {
  var matchingMapping = _.find(mappings, function(mapping) {
    return mapping.seedId === dataItem.workflowId;
  });
  if (matchingMapping) {
    dataItem.workflowId = matchingMapping.newId;
  }
  return dataItem;
};


/**
 * Maps memberships by groups
 * @param  {Object} dataItem - single membership item object
 * @param {Array} mappings - an array of mappings objects for groups
 * @returns {Object} dataItem - membership dataItem object with group property updated with newId of relevant mapping
 */
var mapMemberships = function(dataItem, mappings) {
  var matchingMapping = _.find(mappings, function(mapping) {
    return mapping.seedId === dataItem.group;
  });

  if (matchingMapping) {
    dataItem.group = matchingMapping.newId;
  }
  return dataItem;
};

module.exports = {
  mapRelations: mapRelations
};
