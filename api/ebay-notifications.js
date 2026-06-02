const crypto = require('crypto');

const VERIFICATION_TOKEN = process.env.EBAY_VERIFICATION_TOKEN || '';
const ENDPOINT_URL       = process.env.EBAY_ENDPOINT_URL       || '';

module.exports = (req, res) => {
  // Parse query params ourselves to avoid Vercel's deprecated url.parse()
  const rawUrl = req.url || '';
  const qIndex = rawUrl.indexOf('?');
  const params = new URLSearchParams(qIndex >= 0 ? rawUrl.slice(qIndex + 1) : '');

  console.log(`[ebay] ${req.method} | params=${rawUrl.slice(qIndex + 1)} | token_len=${VERIFICATION_TOKEN.length} | url_len=${ENDPOINT_URL.length}`);

  if (req.method === 'GET') {
    const challenge_code = params.get('challenge_code');

    if (!challenge_code) {
      console.log('[ebay] GET missing challenge_code');
      return res.status(400).json({ error: 'Missing challenge_code' });
    }

    const hash = crypto
      .createHash('sha256')
      .update(challenge_code + VERIFICATION_TOKEN + ENDPOINT_URL)
      .digest('hex');

    console.log(`[ebay] challenge_code=${challenge_code} hash=${hash}`);
    return res.status(200).json({ challengeResponse: hash });
  }

  if (req.method === 'POST') {
    console.log('[ebay] POST notification received');
    return res.status(200).send('OK');
  }

  return res.status(405).send('Method Not Allowed');
};
