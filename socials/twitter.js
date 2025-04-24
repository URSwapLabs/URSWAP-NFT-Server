const { default: axios } = require("axios");
const express = require("express");
const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const { codeVerifier, codeChallenge } = require("../utils/codeVerify");
require("dotenv").config();

const router = express.Router();

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

const TWITTER_CLIENT_ID = process.env.TWITTER_API_KEY;
const TWITTER_CLIENT_SECRET = process.env.TWITTER_SECRET_KEY;
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
const TWITTER_USER_ID = process.env.TWITTER_USER_ID;

const TWITTER_REDIRECT_URI = "https://nft-cors-server.onrender.com/twitter/auth/callback";

passport.use(
    new TwitterStrategy(
        {
            consumerKey: TWITTER_CLIENT_ID,
            consumerSecret: TWITTER_CLIENT_SECRET,
            callbackURL: TWITTER_REDIRECT_URI,
        },
        function (token, tokenSecret, profile, done) {
            console.log("Token:", token);
            console.log("Token Secret:", tokenSecret);
            return done(null, profile);
        }
    )
);

router.get("/auth/twitter", (req, res, next) => {
    const walletAddress = req.query.walletAddress;

    if (!walletAddress) {
        return res.status(400).json({ message: "Wallet address is required" });
    }

    res.cookie("walletAddress", walletAddress, {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
        signed: true,
        secure: true,
        sameSite: "Lax",
    });

    return passport.authenticate("twitter")(req, res, next);
});

router.get(
    "/auth/callback",
    passport.authenticate("twitter", {
        failureRedirect: "/failure",
    }),
    async (req, res) => {

        const twitterUserId = req.user.id;
        const userName = req.user.screen_name;
        const displayName = req.user.displayName;
        const walletAddress = req.signedCookies.walletAddress;

        if(walletAddress) {
            await axios.post('https://nft-cors-server.onrender.com/user/addSocialAccount', {
                walletAddress,
                socialType: 'twitter',
                userId: twitterUserId,
                userName: userName,
                displayName: displayName,
            })
        } else {
            console.log("Wallet Not Found");
        }

        res.cookie("twitterUserId", twitterUserId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
            signed: true,
            maxAge: 15 * 60 * 1000,
        });

        res.redirect("https://urswap-marketplace.vercel.app/follow");
    }
);

router.get("/success", (req, res) => {
    res.send(`Welcome, your Twitter user ID is stored in the cookie.`);
});

// Failure route
router.get("/failure", (req, res) => {
    res.send("Twitter authentication failed.");
});

router.get("/verifyTwitter", async (req, res) => {
    const twitterUserId = req.signedCookies.twitterUserId;
    console.log("Twitter User ID in verify:", twitterUserId);

    if (!twitterUserId) {
        return res.status(401).send("Unauthorized. Please log in first.");
    }

    try {
        const response = await axios.get(
            `https://api.twitter.com/1.1/friendships/show.json?source_id=${twitterUserId}&target_id=${process.env.TWITTER_USER_ID}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
                },
            }
        );

        console.log("Response data:", response.data);
        const followsYou = response.data.data !== undefined;

        res.json({ success: followsYou });
    } catch (error) {
        console.error("Error verifying follow:", error);
        res.status(500).send("Error verifying follow.");
    }
});


module.exports = router;