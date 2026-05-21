/**
 * Salesforce REST API data fetching layer.
 *
 * Uses the OAuth 2.0 client_credentials flow to obtain an access token,
 * then executes SOQL queries via the standard REST /query endpoint.
 *
 * Environment variables required in .env.local:
 *   SF_CLIENT_ID
 *   SF_CLIENT_SECRET
 *   SF_INSTANCE_URL
 *   SF_API_VERSION   (optional, defaults to "v59.0")
 */

// ---------------------------------------------------------------------------
// OAuth token cache — avoids re-authenticating on every request within
// the same server process lifetime.
// ---------------------------------------------------------------------------
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Fetch a Salesforce access token using the client_credentials grant.
 * Caches the token in memory for ~55 minutes (Salesforce tokens last 1 hr).
 */
export async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (5-minute safety margin)
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const instanceUrl = process.env.SF_INSTANCE_URL;
  const clientId = process.env.SF_CLIENT_ID;
  const clientSecret = process.env.SF_CLIENT_SECRET;

  if (!instanceUrl || !clientId || !clientSecret) {
    throw new Error(
      'Missing Salesforce environment variables. Ensure SF_INSTANCE_URL, SF_CLIENT_ID, and SF_CLIENT_SECRET are set in .env.local'
    );
  }

  const tokenRes = await fetch(`${instanceUrl}/services/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenRes.ok || tokenData.error) {
    throw new Error(
      `Salesforce OAuth failed: ${tokenData.error_description || tokenData.error || 'Unknown error'}`
    );
  }

  cachedToken = tokenData.access_token;
  // Cache for 55 minutes (SF tokens expire in 60)
  tokenExpiry = Date.now() + 55 * 60 * 1000;

  return cachedToken as string;
}

/**
 * Execute a SOQL query against the Salesforce REST API.
 *
 * @param soql - A valid SOQL query string.
 * @returns An array of record objects (typed as `any[]`).
 */
export async function salesforceQuery(soql: string): Promise<any[]> {
  const instanceUrl = process.env.SF_INSTANCE_URL;
  const apiVersion = process.env.SF_API_VERSION || 'v59.0';

  if (!instanceUrl) {
    throw new Error('SF_INSTANCE_URL is not set in environment variables.');
  }

  try {
    const accessToken = await getAccessToken();

    const queryUrl = `${instanceUrl}/services/data/${apiVersion}/query?q=${encodeURIComponent(soql)}`;

    const res = await fetch(queryUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      // Disable Next.js fetch cache — always hit Salesforce live
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorBody = await res.text();
      // If token expired mid-request, invalidate cache and retry once
      if (res.status === 401) {
        cachedToken = null;
        tokenExpiry = 0;
        const freshToken = await getAccessToken();
        const retryRes = await fetch(queryUrl, {
          headers: {
            Authorization: `Bearer ${freshToken}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });
        if (!retryRes.ok) {
          throw new Error(`Salesforce query retry failed (${retryRes.status}): ${await retryRes.text()}`);
        }
        const retryData = await retryRes.json();
        return retryData.records || [];
      }
      throw new Error(`Salesforce query failed (${res.status}): ${errorBody}`);
    }

    const data = await res.json();
    return data.records || [];
  } catch (err: any) {
    console.error('[salesforceQuery] Error:', err.message);
    throw new Error(`Salesforce query error: ${err.message}`);
  }
}

export async function salesforceCount(soql: string): Promise<number> {
  const token = await getAccessToken();
  const url = `${process.env.SF_INSTANCE_URL}/services/data/${process.env.SF_API_VERSION || 'v59.0'}/query?q=${encodeURIComponent(soql)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return data.totalSize ?? 0;
}
