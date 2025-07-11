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
        const tokenResponse = await axios.post("https://discord.com/api/oauth2/token", new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: "authorization_code",
            code,
            redirect_uri: REDIRECT_URI,
        }).toString(), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });

        const accessToken = tokenResponse.data.access_token;

        const userResponse = await axios.get("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        console.log("Session data after login: ", userResponse.data.id);

        res.cookie("discordUser", userResponse.data.id, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            signed: true,
            maxAge: 15 * 60 * 1000,
        });

        // req.session.save(() => {
        res.redirect("https://nft.urswap.io/reward");
        // });
    } catch (error) {
        console.error("OAuth Error:", error.response ? error.response.data : error.message);
        res.status(500).send("Authentication Failed!");
    }
});

router.get("/verify-discord", async (req, res) => {
    console.log("Inside verify-discord");
    // const userId = req.session.userId;
    const userId = req.signedCookies.discordUser;
    console.log("userId: ", userId);
    if (!userId) {
        console.log("User not logged in");
        return res.json({ success: false, error: "User not logged in" });
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
        if(error?.rawError?.message === "Unknown Member") {
            console.log("User not in Discord server");
            res.json({ success: false, message: "User is not in the server." });
        }
        console.error("Failed to check user membership", error?.rawError);
        res.status(500).json({ error: "Failed to check user membership", details: error.message });
    }
});

client.login(BOT_TOKEN);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

module.exports = router;