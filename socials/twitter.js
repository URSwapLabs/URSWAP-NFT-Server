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
const TWITTER_REDIRECT_URI = process.env.TWITTER_REDIRECT_URI;
const TWITTER_USER_ID = process.env.TWITTER_USER_ID;

passport.use(
    new TwitterStrategy(
        {
            consumerKey: TWITTER_CLIENT_ID, // API Key
            consumerSecret: TWITTER_CLIENT_SECRET, // API Secret
            callbackURL: TWITTER_REDIRECT_URI, // Redirect URL after Twitter authentication
        },
        function (token, tokenSecret, profile, done) {
            // if (error) {
            //     console.log("Error occurred during Twitter authentication:", error);
            //     return done(error);
            // }
            console.log("Token:", token);  // Log to debug the token
            console.log("Token Secret:", tokenSecret);
            // Store user info (including userId) in the session
            return done(null, profile);
        }
    )
);

router.get("/auth/twitter", passport.authenticate("twitter"));

router.get(
    "/auth/callback",
    passport.authenticate("twitter", {
        failureRedirect: "/failure", // Redirect on failure
    }),
    (req, res) => {
        // Get userId from the Twitter profile
        const twitterUserId = req.user.id;

        console.log("Twitter User ID:", twitterUserId);

        // Set a signed HTTP-only cookie with the Twitter user ID
        res.cookie("twitterUserId", twitterUserId, {
            httpOnly: true,  // Ensures the cookie is not accessible via JavaScript (only accessible by the server)
            secure: process.env.NODE_ENV === "production",  // Set to true if using HTTPS in production
            sameSite: "None",  // Ensures the cookie is sent with cross-origin requests
            signed: true,  // Signs the cookie (to prevent tampering)
            maxAge: 15 * 60 * 1000,  // Cookie expiration time (15 minutes)
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

        // If the response contains data, the user follows your account
        console.log("Response data:", response.data);
        const followsYou = response.data.data !== undefined;

        res.json({ success: followsYou });
    } catch (error) {
        console.error("Error verifying follow:", error);
        res.status(500).send("Error verifying follow.");
    }
});


module.exports = router;