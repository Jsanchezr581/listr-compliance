const https = require('https');

const CLIENT_ID     = process.env.EBAY_CLIENT_ID     || '';
const CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET || '';
const RUNAME        = process.env.EBAY_RUNAME        || '';
const APP_URL       = process.env.APP_URL            || '';

function exchangeCode(code) {
  return new Promise((resolve, reject) => {
    const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const body = new URLSearchParams({
      grant_type:   'authorization_code',
      code,
      redirect_uri: RUNAME,
    }).toString();

    const options = {
      hostname: 'api.ebay.com',
      path:     '/identity/v1/oauth2/token',
      method:   'POST',
      headers:  {
        'Authorization': `Basic ${credentials}`,
        'Content-Type':  'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { reject(e); }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

module.exports = async (req, res) => {
  const rawUrl = req.url || '';
  const qIndex = rawUrl.indexOf('?');
  const params = new URLSearchParams(qIndex >= 0 ? rawUrl.slice(qIndex + 1) : '');

  const code  = params.get('code');
  const state = params.get('state');
  const error = params.get('error');

  console.log(`[ebay/callback] code=${code ? 'present' : 'missing'} state=${state} error=${error}`);

  if (error) {
    return res.redirect(302, `${APP_URL || ''}/api/ebay/declined?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  if (!CLIENT_ID || !CLIENT_SECRET || !RUNAME) {
    return res.status(500).json({ error: 'EBAY_CLIENT_ID, EBAY_CLIENT_SECRET, and EBAY_RUNAME env vars are required' });
  }

  let tokens;
  try {
    const result = await exchangeCode(code);
    if (result.status !== 200) {
      console.error('[ebay/callback] token exchange failed', result.body);
      return res.status(502).json({ error: 'Token exchange failed', detail: result.body });
    }
    tokens = result.body;
    console.log(`[ebay/callback] tokens obtained access_token_expires_in=${tokens.expires_in}`);
  } catch (err) {
    console.error('[ebay/callback] token exchange error', err);
    return res.status(500).json({ error: 'Token exchange error' });
  }

  if (APP_URL) {
    const redirect = new URL('/api/ebay/connected', APP_URL);
    redirect.searchParams.set('access_token',  tokens.access_token);
    redirect.searchParams.set('refresh_token', tokens.refresh_token || '');
    redirect.searchParams.set('expires_in',    tokens.expires_in);
    if (state) redirect.searchParams.set('state', state);
    return res.redirect(302, redirect.toString());
  }

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Connected – Listr</title>
  <style>
    body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; color: #111; }
    h1 { font-size: 1.6rem; }
    p  { color: #555; }
  </style>
</head>
<body>
  <h1>eBay account connected!</h1>
  <p>You can close this window and return to Listr.</p>
</body>
</html>`);
};
