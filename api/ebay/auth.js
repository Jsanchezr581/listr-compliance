const CLIENT_ID   = process.env.EBAY_CLIENT_ID   || '';
const RUNAME      = process.env.EBAY_RUNAME       || '';
const SCOPES      = [
  'https://api.ebay.com/oauth/api_scope',
  'https://api.ebay.com/oauth/api_scope/sell.inventory',
  'https://api.ebay.com/oauth/api_scope/sell.account',
  'https://api.ebay.com/oauth/api_scope/sell.fulfillment',
].join(' ');

module.exports = (req, res) => {
  if (!CLIENT_ID || !RUNAME) {
    return res.status(500).json({ error: 'EBAY_CLIENT_ID and EBAY_RUNAME env vars are required' });
  }

  const state = Math.random().toString(36).slice(2);

  const url = new URL('https://auth.ebay.com/oauth2/authorize');
  url.searchParams.set('client_id',     CLIENT_ID);
  url.searchParams.set('redirect_uri',  RUNAME);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope',         SCOPES);
  url.searchParams.set('state',         state);

  console.log(`[ebay/auth] redirecting to eBay OAuth state=${state}`);
  return res.redirect(302, url.toString());
};
