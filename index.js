const express = require('express');
const cors = require('cors');
const session = require("express-session");
const proxyRoutes = require('./routes/proxy');
const generateNft = require('./routes/generateNft');
const counter = require('./routes/counter');
const collection = require('./routes/collection');
const position = require('./routes/position');
const nftBuy = require('./routes/NFTBuy');
const nftAuction = require('./routes/auctionNFT');
const discord = require('./socials/discordVerification');
const connectDb = require('./db');
require("dotenv").config();

const app = express();

app.use(cors({
    origin: 'https://urswap-marketplace.vercel.app',
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        // domain: 'urswap-marketplace.vercel.app',
        domain: '.railway.app',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000
    },
}));

app.use('/proxy', proxyRoutes);
app.use('/generateNft', generateNft);
app.use('/counter', counter);
app.use('/collection', collection);
app.use('/position', position);
app.use('/nftBuy', nftBuy);
app.use('/nftAuction', nftAuction);
app.use('/discord', discord);

connectDb();

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log("Session Secret: ", process.env.SESSION_SECRET);
});
