var _ = require('lodash');
var hash = require('object-hash');
var config = require('./config');

var syncFields = config.get('syncFields');

/**
 *
 * A hash function for result objects
 *
 * Here, we compare the relevant fields in the result object to determine if there are any collisions
 *
 * If the stepResult keys are identical and the status is the same, the objects are considered equal.
 *
 * @param result
 * @param result.stepResults - An object containing the results for each step
 * @param result.status - The status of the result
 */
function hashResults(result) {

  var stepKeys = _.sortBy(_.keys(result.stepResults));
  stepKeys.push(result.status);

  return stepKeys.join(config.keySeperator);
}

/**
 *
 * Hashing a workorder object.
 *
 * Here, we compare the relevant fields in the result object to determine if there are any collisions
 *
 * @param workorder
 * @returns {string}
 */
function hashWorkorders(workorder) {
  return hash.sha1(_.pick(workorder, syncFields.workorders));
}

/**
 *
 * Hashing a workflow object.
 *
 * Here, we compare the relevant fields in the result object to determine if there are any collisions
 *
 * @param workflow
 * @returns {string}
 */
function hashWorkflows(workflow) {
  var _workflow = _.pick(workflow, syncFields.workflows);

  _workflow.steps = workflow.steps;

  //Checking if any steps have changed
  if (_workflow.steps) {
    _workflow.steps = _.map(_workflow.steps, function(step) {
      return _.pick(step, syncFields.workflowStep);
    });
  }

  return hash.sha1(_workflow);
}


module.exports = {
  result: hashResults,
  workorders: hashWorkorders,
  workflows: hashWorkflows
};