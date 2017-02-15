
// default list of types of objects to remove, can be overriden when passed in request body
// order of the list is important for building relations between them, parent items should be listed first
// e.g. workorders have references to work flows using the workflow IDs. Therefore, the work flows should be created first.
module.exports = [
  'file',
  'group',
  'membership',
  'messages',
  'result',
  'workflows',
  'workorders'
];