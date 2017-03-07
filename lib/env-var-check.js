
/*
 * Check whether the required environment variables are
 * set when cloud app starts
 */

  if (!process.env.WFM_AUTH_GUID) {
    console.error('Missing environment variable: WFM_AUTH_GUID');
  }

  if (!process.env.WFM_AUTH_POLICY_ID) {
    console.error('Missing environment variable: WFM_AUTH_POLICY_ID');
  }
