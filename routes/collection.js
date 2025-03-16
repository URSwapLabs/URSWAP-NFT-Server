const express = require("express");
const Collection = require("../models/Collections");
const router = express.Router();
require("dotenv").config();

router.post("/addCollection", async (req, res) => {
    try {
        const { walletAddress, collection } = req.body;

        if (!walletAddress || !collection || !collection.collectionAddress) {
            return res.status(400).json({ success: false, message: "Invalid input data" });
        }

        let userCollection = await Collection.findOne({ walletAddress });

        if (!userCollection) {
            userCollection = new Collection({
                walletAddress,
                nftCollections: [collection]
            });
        } else {
            const isDuplicate = userCollection.nftCollections.some(
                (col) => col.collectionAddress === collection.collectionAddress
            );

            if (isDuplicate) {
                return res.status(400).json({ success: false, message: "Collection Address Already Exists" });
            }

            userCollection.nftCollections.push(collection);
        }

        await userCollection.save();

        return res.status(200).json({ success: true, message: "Collection added successfully!" });

    } catch (error) {
        console.error("Error while adding collection:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.post("/updateCollection", async (req, res) => {
    try {
        const { walletAddress, collectionAddress } = req.body;

        if (!walletAddress || !collectionAddress) {
            return res.status(400).json({ success: false, message: "Invalid input data" });
        }

        const user = await Collection.findOne({ walletAddress: walletAddress });

        if (user) {
            if (!user.nftCollections.includes(collectionAddress)) {
                user.nftCollections.push(collectionAddress);
                await user.save();
                return res.status(200).json({
                    success: true,
                    message: "Collection added successfully",
                    nftCollections: user.nftCollections,
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Collection already exists in the user's collections",
                });
            }
        } else {
            const newUser = new Collection({
                walletAddress: walletAddress,
                nftCollections: [collectionAddress],
            });

            await newUser.save();
            return res.status(201).json({
                success: true,
                message: "New user and collection added successfully",
                nftCollections: newUser.nftCollections,
            });
        }
    } catch (error) {
        console.log("Error while updating collection:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.get('/getCollections', async (req, res) => {
    try {
        const { walletAddress } = req.query;

        if (!walletAddress) {
            return res.status(400).json({ success: false, message: "Invalid input data" });
        }

        const userCollection = await Collection.findOne({ walletAddress });

        if (!userCollection) {
            return res.status(404).json({ success: false, message: "No collections found" });
        }

        return res.status(200).json({ success: true, collections: userCollection.nftCollections });

    } catch (error) {
        console.error("Error while fetching collections:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.get("/checkCollection", async (req, res) => {
    try {
        const { walletAddress, collectionAddress } = req.query;

        if (!walletAddress || !collectionAddress) {
            return res.status(400).json({ message: "walletAddress and collectionAddress are required" });
        }

        const user = await Collection.findOne({ walletAddress });
        
        if (!user) {
            return res.status(404).json({ message: "Wallet address not found" });
        }

        const collectionExists = user.nftCollections.some(
            (collection) => collection.collectionAddress === collectionAddress
        );

        if (collectionExists) {
            return res.status(200).json({ exists: true, message: "Collection found" });
        } else {
            return res.status(404).json({ exists: false, message: "Collection not found" });
        }
    } catch (error) {
        console.error("Error checking collection:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;