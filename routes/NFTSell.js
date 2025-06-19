const express = require("express");
const router = express.Router();
const NFTSell = require("../models/NFTSell");

router.post("/sell", async (req, res) => {
    try {
        const { collectionAddress, seller, nfts } = req.body;

        if (!collectionAddress || !seller || !nfts || !Array.isArray(nfts)) {
            return res.status(400).json({ success: false, message: "Invalid request data" });
        }

        let nftSale = await NFTSell.findOne({ collectionAddress, seller });

        if (nftSale) {
            nftSale.nfts.push(...nfts);
        } else {
            nftSale = new NFTSell({ collectionAddress, seller, nfts });
        }

        await nftSale.save();
        res.status(201).json({ success: true, message: "NFT(s) listed successfully", data: nftSale });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

router.get("/listings", async (req, res) => {
    try {
        const listings = await NFTSell.find();
        res.status(200).json(listings);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.get("/listing", async (req, res) => {
    try {
        const { collectionAddress, nftId } = req.query;

        const listing = await NFTSell.findOne({
            collectionAddress,
            "nfts.nftId": nftId
        });

        if (!listing) {
            return res.status(200).json({ success: false, message: "NFT listing not found" });
        }

        const nft = listing.nfts.find(nft => nft.nftId === nftId);

        res.status(200).json({ success: true, nft });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
});

router.get("/listing", async (req, res) => {
    try {
        const { collectionAddress, nftId } = req.query;
        const listing = await NFTSell.findOne({
            collectionAddress,
            "nfts.nftId": nftId
        });
        if (!listing) {
            return res.status(404).json({ success: false, message: "NFT listing not found" });
        }
        const nft = listing.nfts.find(nft => nft.nftId === nftId);
        res.status(200).json({ success: true, nft: nft });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

router.put("/update/:collectionAddress/:nftId", async (req, res) => {
    try {
        const { collectionAddress, nftId } = req.params;
        const updateData = req.body;

        const updatedListing = await NFTSell.findOneAndUpdate(
            { collectionAddress, "nfts.nftId": nftId },
            { $set: { "nfts.$": { ...updateData, nftId } } },
            { new: true }
        );

        if (!updatedListing) {
            return res.status(404).json({ message: "NFT listing not found" });
        }

        res.status(200).json({ message: "NFT listing updated", data: updatedListing });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.delete("/delete/:collectionAddress/:nftId", async (req, res) => {
    try {
        const { collectionAddress, nftId } = req.params;

        const updatedListing = await NFTSell.findOneAndUpdate(
            { collectionAddress },
            { $pull: { nfts: { nftId } } },
            { new: true }
        );

        if (!updatedListing) {
            return res.status(404).json({ message: "NFT listing not found" });
        }

        res.status(200).json({ message: "NFT removed from listing", data: updatedListing });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;