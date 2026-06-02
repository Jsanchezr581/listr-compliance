module.exports = (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Privacy Policy – Listr</title>
  <style>
    body { font-family: sans-serif; max-width: 720px; margin: 60px auto; padding: 0 24px; color: #111; line-height: 1.6; }
    h1 { font-size: 1.8rem; margin-bottom: 8px; }
    h2 { font-size: 1.1rem; margin-top: 32px; }
    p  { margin: 8px 0; }
  </style>
</head>
<body>
  <h1>Privacy Policy</h1>
  <p>Last updated: June 2, 2026</p>

  <h2>1. Data We Collect</h2>
  <p>When you connect your eBay account to Listr, we receive an OAuth access token that allows us to interact with the eBay API on your behalf. We do not store your eBay password.</p>

  <h2>2. How We Use Your Data</h2>
  <p>We use your eBay account data solely to provide Listr's listing and inventory management features. We do not sell or share your data with third parties.</p>

  <h2>3. Account Deletion</h2>
  <p>In compliance with the eBay Marketplace Account Deletion/Closure notification requirements, when eBay notifies us that your account has been deleted or closed, we will promptly delete all associated data from our systems.</p>

  <h2>4. Data Retention</h2>
  <p>We retain your data only for as long as necessary to provide the service. You may request deletion of your data at any time by contacting us.</p>

  <h2>5. Contact</h2>
  <p>For privacy questions or data deletion requests, contact us at: <a href="mailto:jsanchezr581@gmail.com">jsanchezr581@gmail.com</a></p>
</body>
</html>`);
};
