const https = require('https');

const CLIENT_ID     = process.env.EBAY_CLIENT_ID     || '';
const CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET || '';

module.exports = (req, res) => {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    return res.status(500).json({ error: 'EBAY_CLIENT_ID and EBAY_CLIENT_SECRET env vars are required' });
  }

  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const body = 'grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope';

  const options = {
    hostname: 'api.ebay.com',
    path:     '/identity/v1/oauth2/token',
    method:   'POST',
    headers:  {
      'Authorization':  `Basic ${credentials}`,
      'Content-Type':   'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(body),
    },
  };

  const request = https.request(options, (ebayRes) => {
    let data = '';
    ebayRes.on('data', chunk => { data += chunk; });
    ebayRes.on('end', () => {
      let parsed;
      try { parsed = JSON.parse(data); } catch { parsed = data; }

      console.log(`[token-test] status=${ebayRes.statusCode} body=${data}`);

      if (ebayRes.statusCode === 200) {
        return res.status(200).json({
          success:    true,
          token_type: parsed.token_type,
          expires_in: parsed.expires_in,
          note:       'Credentials are valid. Token omitted for security.',
        });
      }

      return res.status(ebayRes.statusCode).json({
        success: false,
        status:  ebayRes.statusCode,
        error:   parsed,
      });
    });
  });

  request.on('error', (err) => {
    console.error('[token-test] request error', err);
    res.status(500).json({ error: err.message });
  });

  request.write(body);
  request.end();
};
