// const express = require("express");
// const { Client, GatewayIntentBits } = require("discord.js");
// const { default: axios } = require("axios");

// const app = express();
// const PORT = 8080;

// const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
// // const fs = require('fs');


// // // Load existing users
// // let users = [];
// // try {
// //   users = JSON.parse(fs.readFileSync('./users.json'));
// // } catch (err) {
// //   console.error('Error reading users.json:', err);
// // }

// // Event: When the bot is ready
// client.on('ready', () => {
//   console.log(`Logged in as ${client.user.tag}`);
// });

// client.on('guildMemberAdd', (member) => {
//     if (member.guild.id === yourServerId) {
//       console.log(`${member.user.tag} joined the server!`);
//       users.push(member.user.id); // Add user ID to the list
//       fs.writeFileSync('users.json', JSON.stringify(users)); // Save to file
//     }
// });

// app.get("/check-discord-follow", async (req, res) => {
//     const { userId } = req.query;
//     if (!userId) return res.status(400).json({ error: "User ID is required" });

//     try {
//         const guild = await client.guilds.fetch(yourServerId);
//         const member = await guild.members.fetch(userId);

//         if (member) {
//             res.json({ success: true, message: "User is in the Discord server!" });
//         } else {
//             res.json({ success: false, message: "User is not in the server." });
//         }
//     } catch (error) {
//         res.status(500).json({ error: "Failed to check user membership", details: error.message });
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

// const CLIENT_ID = "1352964542027796511";
// const CLIENT_SECRET = "NjigqXzPbYSFj2e7bdFyOFn0We6bWknA";
// const REDIRECT_URI = "http://localhost:8080/auth/discord/callback";

// app.get("/auth/discord/callback", async (req, res) => {
//     const code = req.query.code;

//     try {
//         // 🔥 Exchange code for access token
//         const tokenResponse = await axios.post("https://discord.com/api/oauth2/token", new URLSearchParams({
//             client_id: CLIENT_ID,
//             client_secret: CLIENT_SECRET,
//             grant_type: "authorization_code",
//             code,
//             redirect_uri: REDIRECT_URI
//         }).toString(), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });

//         const accessToken = tokenResponse.data.access_token;

//         // 🔥 Fetch user ID
//         const userResponse = await axios.get("https://discord.com/api/users/@me", {
//             headers: { Authorization: `Bearer ${accessToken}` }
//         });

//         const userId = userResponse.data.id;

//         // 🔥 Automatically add the user to your server
//         const guildId = yourServerId; // Replace with your server ID
//         await axios.put(`https://discord.com/api/guilds/${guildId}/members/${userId}`, {
//             access_token: accessToken
//         }, {
//             headers: { 
//                 Authorization: `Bot YOUR_BOT_TOKEN`,
//                 "Content-Type": "application/json"
//             }
//         });

//         // Redirect user back with confirmation
//         res.redirect(`http://localhost:3000/dashboard?joined=true&userId=${userId}`);
//     } catch (error) {
//         console.error("Discord Auth Error:", error);
//         res.status(500).send("Authentication failed");
//     }
// });


// // Log in the bot
// client.login(token);