const axios = require('axios');
const express = require('express');
const router = express.Router();

router.get('/auth/callback', async (req, res) => {
  const { code } = req.query;

  console.log("Inside Tiktok callback");

  try {
    // Exchange code for access token
    const tokenRes = await axios.post('https://open.tiktokapis.com/v2/oauth/token', {
      client_key: process.env.TIKTOK_CLIENT_KEY,
      client_secret: process.env.TIKTOK_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: 'https://nft-cors-server.onrender.com/tiktok/auth/callback',
    });

    const accessToken = tokenRes.data.access_token;

    // Get user profile info
    const userRes = await axios.get('https://open.tiktokapis.com/v2/user/info/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = userRes.data.data.user;
    // Save user to MongoDB or session here

    // Redirect to your Angular frontend with token or session
    res.redirect(`http://localhost:3000/follow?username=${userData.display_name}`);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('TikTok login failed');
  }
});

module.exports = router;