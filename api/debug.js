const crypto = require('crypto');

const VERIFICATION_TOKEN = process.env.EBAY_VERIFICATION_TOKEN;
const ENDPOINT_URL = process.env.EBAY_ENDPOINT_URL;

module.exports = (req, res) => {
  const { challenge_code } = req.query;
  const token = VERIFICATION_TOKEN || '';
  const url   = ENDPOINT_URL   || '';

  const info = {
    endpoint_url:          url,
    endpoint_url_length:   url.length,
    token_set:             !!token,
    token_length:          token.length,
    token_first4:          token.substring(0, 4) + '****',
    token_last4:           '****' + token.substring(token.length - 4),
  };

  if (challenge_code) {
    info.challenge_code = challenge_code;
    info.computed_hash  = crypto
      .createHash('sha256')
      .update(challenge_code + token + url)
      .digest('hex');
  }

  return res.status(200).json(info);
};
