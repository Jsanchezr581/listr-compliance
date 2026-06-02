const APP_URL = process.env.APP_URL || '';

module.exports = (req, res) => {
  const rawUrl = req.url || '';
  const qIndex = rawUrl.indexOf('?');
  const params = new URLSearchParams(qIndex >= 0 ? rawUrl.slice(qIndex + 1) : '');

  const code  = params.get('code');
  const state = params.get('state');

  console.log(`[ebay/callback] code=${code ? 'present' : 'missing'} state=${state}`);

  if (!code) {
    return res.status(400).send('Missing authorization code.');
  }

  // Once your webapp is ready, forward the code so it can exchange for tokens:
  if (APP_URL) {
    const redirect = new URL('/api/ebay/token', APP_URL);
    redirect.searchParams.set('code', code);
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
