// OAuth callback relay — eBay redirects here, we forward to the local LISTR app
module.exports = (req, res) => {
  const params = new URLSearchParams(req.url.includes('?') ? req.url.split('?')[1] : '');
  const code    = params.get('code')    || '';
  const state   = params.get('state')   || '';
  const error   = params.get('error')   || '';

  const LOCAL = process.env.LISTR_LOCAL_URL || 'https://127.0.0.1:5000';
  const target = `${LOCAL}/api/ebay/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}&error=${encodeURIComponent(error)}`;

  res.writeHead(302, { Location: target });
  res.end();
};
