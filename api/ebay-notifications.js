const crypto = require('crypto');

const VERIFICATION_TOKEN = process.env.EBAY_VERIFICATION_TOKEN;
const ENDPOINT_URL = process.env.EBAY_ENDPOINT_URL;

module.exports = (req, res) => {
  console.log(`[ebay] ${req.method} ${req.url} | query: ${JSON.stringify(req.query)}`);

  if (req.method === 'GET') {
    const { challenge_code } = req.query;

    if (!challenge_code) {
      console.log('[ebay] GET with no challenge_code');
      return res.status(400).json({ error: 'Missing challenge_code' });
    }

    const hash = crypto
      .createHash('sha256')
      .update(challenge_code + VERIFICATION_TOKEN + ENDPOINT_URL)
      .digest('hex');

    console.log(`[ebay] challenge_code=${challenge_code} | token_len=${(VERIFICATION_TOKEN||'').length} | url_len=${(ENDPOINT_URL||'').length} | hash=${hash}`);

    return res.status(200).json({ challengeResponse: hash });
  }

  if (req.method === 'POST') {
    console.log('[ebay] POST deletion notification:', JSON.stringify(req.body));
    return res.status(200).send('OK');
  }

  return res.status(405).send('Method Not Allowed');
};
