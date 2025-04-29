const axios = require('axios');
const express = require('express');
const qs = require('qs');
const router = express.Router();
require('dotenv').config();

router.get('/auth/callback', async (req, res) => {
    const { code } = req.query;

    console.log("Inside Tiktok callback");

    try {
        const tokenRes = await axios.post(
            'https://open.tiktokapis.com/v2/oauth/token/',
            qs.stringify({
                client_key: process.env.TIKTOK_CLIENT_KEY,
                client_secret: process.env.TIKTOK_CLIENT_SECRET,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: 'https://nft-cors-server-production.up.railway.app/tiktok/auth/callback',
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        const accessToken = tokenRes.data.access_token;

        const userRes = await axios.get('https://open.tiktokapis.com/v2/user/info/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            fields: 'open_id,username,avatar_url',
          }
        });

        console.log("User Response: ", userRes.data);
        const userData = userRes.data.data.user;
        console.log("User Data: ", userData);

        res.redirect(`http://localhost:3000/follow`);
    } catch (err) {
        console.error(err?.response.data);
        res.status(500).send('TikTok login failed');
    }
});

module.exports = router;