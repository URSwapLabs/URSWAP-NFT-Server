const express = require("express");
const mongoose = require("mongoose");
const AuctionNFT = require("../models/AuctionNFT");

const router = express.Router();

router.post("/addAuction", async (req, res) => {
    try {
        const { walletAddress, nft } = req.body;

        if (!walletAddress || !nft) {
            return res.status(400).json({ message: "walletAddress and NFT data are required" });
        }

        let userAuction = await AuctionNFT.findOne({ walletAddress });

        if (!userAuction) {
            userAuction = new AuctionNFT({ walletAddress, NFTs: [nft] });
        } else {
            userAuction.NFTs.push(nft);
        }

        await userAuction.save();
        res.status(201).json({ message: "Auction added successfully", auction: userAuction });
    } catch (error) {
        console.error("Error adding auction:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/updateBid", async (req, res) => {
    try {
        const { walletAddress, auctionId, bidAmount } = req.body;

        if (!walletAddress || !auctionId || bidAmount === undefined) {
            return res.status(400).json({ message: "Invalid data provided" });
        }

        const userAuction = await AuctionNFT.findOne({ walletAddress });
        if (!userAuction) return res.status(200).json({ message: "User auction not found" });

        const nft = userAuction.NFTs.find(nft => nft.auctionId === auctionId);
        if (!nft) return res.status(200).json({ message: "Auction not found" });

        nft.bidAmount = bidAmount;
        await userAuction.save();

        res.status(200).json({ message: "Bid amount updated successfully", nft });
    } catch (error) {
        console.error("Error updating bid amount:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/userAuctions", async (req, res) => {
    try {
        const { walletAddress } = req.query;
        const userAuction = await AuctionNFT.findOne({ walletAddress });

        if (!userAuction) {
            return res.status(200).json({ success: false, message: "No auctions found for this user" });
        }

        res.status(200).json({ success:true, userAuction });
    } catch (error) {
        console.error("Error fetching user auctions:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.get("/userAuction", async (req, res) => {
    try {
        const { walletAddress, auctionId } = req.query;
        const userAuction = await AuctionNFT.findOne({ walletAddress });

        if (!userAuction) {
            return res.status(200).json({ success: false, message: "No auctions found for this user" });
        }

        const nft = userAuction.NFTs.find(nft => nft.auctionId === auctionId);
        if (!nft) {
            return res.status(200).json({ success: false, message: "Auction not found" });
        }

        res.status(200).json({success: true, nft});
    } catch (error) {
        console.error("Error fetching auction:", error);
        res.status(500).json({ success: true, message: "Internal server error" });
    }
});

router.get("/createdAuctions", async (req, res) => {
    try {
        const { walletAddress, creatorAddress } = req.query;
        const userAuction = await AuctionNFT.findOne({ walletAddress });

        if (!userAuction) {
            return res.status(200).json({ success: false, message: "No auctions found for this user" });
        }

        const nfts = userAuction.NFTs.filter(nft => nft.creatorAddress === creatorAddress);
        if (nfts.length === 0) {
            return res.status(200).json({ success: false, message: "No auctions found for this creator" });
        }

        res.status(200).json({ success: true, nfts });
    } catch (error) {
        console.error("Error fetching auctions:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.delete("/removeNFT", async (req, res) => {
    try {
        const { walletAddress, auctionId } = req.query;

        const userAuction = await AuctionNFT.findOne({ walletAddress });

        if (!userAuction) {
            return res.status(200).json({ success: false, message: "User auction not found" });
        }

        const updatedNFTs = userAuction.NFTs.filter(nft => nft.auctionId !== auctionId);

        if (updatedNFTs.length === userAuction.NFTs.length) {
            return res.status(200).json({ success: false, message: "NFT not found in user's auctions" });
        }

        userAuction.NFTs = updatedNFTs;
        await userAuction.save();

        res.status(200).json({ success: true, message: "NFT removed successfully", updatedNFTs });

    } catch (error) {
        console.error("Error removing NFT:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = router;