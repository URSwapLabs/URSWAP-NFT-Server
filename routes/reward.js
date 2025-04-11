const express = require('express');
const Reward = require('../models/Reward');
const User = require('../models/User');

const router = express.Router();

router.post('/addReward', async (req, res) => {
    const { walletAddress, type, postLink } = req.body;

    if (!walletAddress || !type || !postLink) {
        return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    try {
        const user = await User.findOne({ walletAddress });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const social = user.socials[type];
        if (!social || !social.userId) {
            return res.status(400).json({
                success: false,
                error: `You must connect your ${type} account before claiming this reward.`,
            });
        }

        const existingReward = await Reward.findOne({ walletAddress, type });
        if (existingReward) {
            return res.status(400).json({
                success: false,
                error: `You’ve already submitted a reward request for ${type}`,
            });
        }

        const newReward = new Reward({ walletAddress, type, postLink });
        await newReward.save();

        res.status(201).json({ success: true, message: 'Reward added successfully', reward: newReward });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;