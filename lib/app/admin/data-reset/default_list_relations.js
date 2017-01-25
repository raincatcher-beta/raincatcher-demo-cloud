
// default demo relations mapping - workorders are dependent on workflows (through workflowId)
// and membership is dependent on group
module.exports = {
  workorders: 'workflows',
  membership: 'group'
};