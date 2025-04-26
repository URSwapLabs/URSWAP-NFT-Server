const axios = require('axios');
const express = require('express');
const router = express.Router();

router.get('/auth/callback', async (req, res) => {
    const { code } = req.query;

    console.log("Inside Tiktok callback");

    try {
        const tokenRes = await axios.post(
            'https://open.tiktokapis.com/v2/oauth/token',
            qs.stringify({  // <-- use qs.stringify to encode
                client_key: process.env.TIKTOK_CLIENT_KEY,
                client_secret: process.env.TIKTOK_CLIENT_SECRET,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: 'https://nft-cors-server-production.up.railway.app/tiktok/auth/callback',
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded', // <-- very important
                },
            }
        );

        console.log("TokenRes: ", tokenRes.data);

        // const accessToken = tokenRes.data.access_token;

        // const userRes = await axios.get('https://open.tiktokapis.com/v2/user/info/', {
        //   headers: {
        //     Authorization: `Bearer ${accessToken}`,
        //   },
        // });

        // const userData = userRes.data.data.user;

        res.redirect(`http://localhost:3000/follow`);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).send('TikTok login failed');
    }
});

module.exports = router;