const axios = require('axios');
const express = require('express');
const qs = require('qs');
const router = express.Router();
require('dotenv').config();

// router.get('/auth/tiktok', async (req, res) => {
//     const walletAddress = req.query.walletAddress;

//     if (!walletAddress) {
//         return res.status(400).json({ message: "Wallet address is required" });
//     }

//     res.cookie("walletAddress", walletAddress, {
//         maxAge: 5 * 60 * 1000,
//         httpOnly: true,
//         signed: true,
//         secure: true,
//         sameSite: "Lax",
//     });

//     const redirectUri = 'https://nft-cors-server-production.up.railway.app/tiktok/auth/callback';
//     const authUrl = `https://open-api.tiktok.com/platform/oauth/connect/?client_key=${process.env.TIKTOK_CLIENT_KEY}&response_type=code&scope=user.info.basic,user.info.social&redirect_uri=${encodeURIComponent(redirectUri)}`;

//     res.redirect(authUrl);
// })

router.get('/auth/callback', async (req, res) => {
    const { code, state: walletAddress } = req.query;

    console.log("Wallet Address:", walletAddress);

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

        const tiktokUserId = userRes.data.user.open_id;
        const username = userRes.data.user.username;
        const avatarUrl = userRes.data.user.avatar_url;

        if (walletAddress) {
            await axios.post('https://nft-cors-server-production.up.railway.app/user/addSocialAccount', {
                walletAddress,
                socialType: 'tiktok',
                userId: tiktokUserId,
                userName: username,
                displayName: username,
                userIcon: avatarUrl
            })
        } else {
            console.log("Wallet Not Found");
        }

        res.redirect(`http://localhost:3000/follow`);
    } catch (err) {
        console.error(err?.response.data);
        res.status(500).send('TikTok login failed');
    }
});

module.exports = router;