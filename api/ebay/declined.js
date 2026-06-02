module.exports = (req, res) => {
  console.log('[ebay/declined] user declined authorization');

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Authorization Declined – Listr</title>
  <style>
    body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; color: #111; }
    h1 { font-size: 1.6rem; }
    p  { color: #555; }
    a  { color: #0070f3; }
  </style>
</head>
<body>
  <h1>Authorization declined</h1>
  <p>You chose not to connect your eBay account. You can try again from <a href="${process.env.APP_URL || '#'}">Listr</a>.</p>
</body>
</html>`);
};
