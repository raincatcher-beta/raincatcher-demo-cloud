
/*
 * Check whether the required evnironment variables are
 * set when cloud app starts
 */

  if (!process.env.WFM_AUTH_GUID) {
    console.error('Missing evnironment variable: WFM_AUTH_GUID');
  }

  if (!process.env.WFM_AUTH_POLICY_ID) {
    console.error('Missing evnironment variable: WFM_AUTH_POLICY_ID');
  }