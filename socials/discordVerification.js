const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");
const { default: axios } = require("axios");
require("dotenv").config();

const router = express.Router();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const GUILD_ID = process.env.GUILD_ID;
const BOT_TOKEN = process.env.BOT_TOKEN;

router.get("/auth/discord", (req, res) => {
    const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify`;
    res.redirect(discordAuthUrl);
});

router.get("/auth/discord/callback", async (req, res) => {
    const code = req.query.code;

    try {
        // 🔥 Exchange Code for Access Token
        const tokenResponse = await axios.post("https://discord.com/api/oauth2/token", new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: "authorization_code",
            code,
            redirect_uri: REDIRECT_URI,
        }).toString(), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });

        const accessToken = tokenResponse.data.access_token;

        // 🔥 Get User Info
        const userResponse = await axios.get("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        req.session.userId = userResponse.data.id;

        console.log("Session data after login: ", req.session);

        req.session.save(() => {
            res.redirect("https://urswap-marketplace.vercel.app/follow");
        });
    } catch (error) {
        console.error("OAuth Error:", error.response ? error.response.data : error.message);
        res.status(500).send("Authentication Failed!");
    }
});

router.get("/verify-discord", async (req, res) => {
    console.log("Inside verify-discord");
    const userId = req.session.userId;
    console.log("userId: ", userId);
    if (!req.session.userId) {
        console.log("User not logged in");
        return res.json({ joined: false, error: "User not logged in" });
    }
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        const member = await guild.members.fetch(userId);

        if (member) {
            console.log("User in Discord server");
            res.json({ success: true, message: "User is in the Discord server!" });
        } else {
            console.log("User not in Discord server");
            res.json({ success: false, message: "User is not in the server." });
        }
    } catch (error) {
        console.error("Failed to check user membership", error);
        res.status(500).json({ error: "Failed to check user membership", details: error.message });
    }
});

client.login(BOT_TOKEN);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

module.exports = router;