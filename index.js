const express = require('express');
const cors = require('cors');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const user = require('./routes/user');
const reward = require('./routes/reward');
const proxyRoutes = require('./routes/proxy');
const generateNft = require('./routes/generateNft');
const counter = require('./routes/counter');
const collection = require('./routes/collection');
const position = require('./routes/position');
const nftBuy = require('./routes/NFTBuy');
const nftAuction = require('./routes/auctionNFT');
const discord = require('./socials/discord');
const twitter = require('./socials/twitter');
const telegram = require('./socials/telegram');
const youtube = require('./socials/youtube');
const tiktok = require('./socials/tiktok');
const download = require('./routes/download');
const connectDb = require('./db');
require("dotenv").config();

const app = express();

app.use(cors({
    origin: 'https://nft.urswap.io/',
    // origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    // cookie: {
    //     secure: true,
    //     sameSite: "None",
    //     httpOnly: true,
    //   },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/user', user);
app.use('/reward', reward);
app.use('/proxy', proxyRoutes);
app.use('/generateNft', generateNft);
app.use('/counter', counter);
app.use('/collection', collection);
app.use('/position', position);
app.use('/nftBuy', nftBuy);
app.use('/nftAuction', nftAuction);
app.use('/discord', discord);
app.use('/twitter', twitter);
app.use('/telegram', telegram);
app.use('/youtube', youtube);
app.use('/tiktok', tiktok);
app.use('/download', download);

connectDb();

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
