const express = require('express');
const USER = require('../models/User');

const router = express.Router();

// Add a Social Account
router.post('/addSocialAccount', async (req, res) => {
    try {
        const { walletAddress, socialType, userId, userName, displayName, userIcon } = req.body;

        console.log("Received data: ", req.body);

        let user = await USER.findOne({ walletAddress });

        if (!user) {
            user = new USER({
                walletAddress,
                socials: {}
            });
        }

        user.socials[socialType] = { userId, userName, displayName, userIcon };
        await user.save();

        return res.status(200).json({ success: true, message: 'Social account added successfully' });
    } catch (error) {
        console.error('Error adding social account: ', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Update User Info
router.post('/updateUserInfo', async (req, res) => {
    try {
        const { walletAddress, name, imageURI, email } = req.body;

        let user = await USER.findOne({ walletAddress });

        if (!user) {
            user = new USER({
                walletAddress,
                socials: {}
            });
        }

        user.name = name;
        user.imageURI = imageURI;
        user.email = email;

        await user.save();

        return res.status(200).json({ success: true, message: 'User info updated successfully' });
    } catch (error) {
        console.error('Error updating user info: ', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

// Get user by wallet address
router.get('/getUser', async (req, res) => {
    try {
        const { walletAddress } = req.query;
        const user = await USER.findOne({ walletAddress });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({ success: true, user});
    } catch (error) {
        console.error('Error fetching user: ', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

module.exports = router;