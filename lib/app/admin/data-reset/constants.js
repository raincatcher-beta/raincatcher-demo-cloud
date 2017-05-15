module.exports = {
  ITEM_TYPE_LIST: [
    'file',
    'group',
    'membership',
    'result',
    'workflows',
    'workorders'
  ],
  LIST_RELATIONS: {
    workorders: 'workflows',
    membership: 'group'
  },
  SYNC_COLLECTIONS: [
    'fhsync_workorders_records',
    'fhsync_workflows_updates',
    'fhsync_workflows_records',
    'fhsync_result_updates',
    'fhsync_result_records',
    'fhsync_datasetClients',
    'fhsync_locks',
    'fhsync_queue',
    'fhsync_workorders_updates',
    'fhsync_pending_queue',
    'fhsync_ack_queue'
  ]
};