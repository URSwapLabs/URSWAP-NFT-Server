// controllers/nftController.js or routes/nft.js
const express = require('express');
const router = express.Router();
const NFTCollection = require('../models/Marketplace');

// POST /nft/mint
router.post('/mint', async (req, res) => {
  try {
    const { collectionAddress, nftId, owner, collectionName } = req.body;

    if (!collectionAddress || nftId === undefined || !owner) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let collection = await NFTCollection.findOne({ collectionAddress });

    if (!collection) {
      collection = new NFTCollection({
        collectionAddress,
        collectionName: collectionName || "Untitled Collection",
        nfts: [],
      });
    }

    // Check if NFT already exists
    const exists = collection.nfts.find(n => n.nftId === nftId);
    if (exists) {
      return res.status(409).json({ success: false, message: "NFT with this ID already exists in collection" });
    }

    collection.nfts.push({ nftId, owner });
    await collection.save();

    res.status(201).json({
      success: true,
      message: "NFT minted successfully",
      data: collection
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
});

router.post("/sell", async (req, res) => {
  try {
    const { collectionAddress, nftId, owner, status, startTime, endTime } = req.body;

    if (
      !collectionAddress || typeof nftId !== "number" ||
      !["listed", "auctioned"].includes(status) ||
      !startTime || !endTime || isNaN(startTime) || isNaN(endTime)
    ) {
      return res.status(400).json({ success: false, error: "Invalid input data." });
    }

    let collection = await NFTCollection.findOne({ collectionAddress });
    if (!collection) {
      return res.status(404).json({ success: false, error: "Collection not found." });
    }

    let nft = collection.nfts.find(n => n.nftId === nftId);

    if (nft) {
      nft.status = status;
      nft.startTime = startTime
      nft.endTime = endTime
    } else {
      if (!owner) {
        return res.status(400).json({ success: false, error: "NFT doesn't exist. 'owner' is required to create a new one." });
      }

      collection.nfts.push({
        nftId,
        owner,
        status,
        startTime: startTime,
        endTime: endTime,
      });
    }

    await collection.save();
    res.json({ success: true, message: "NFT listed successfully.", nftId });
  } catch (err) {
    console.error("Error in selling NFT:", err);
    res.status(500).json({ success: false, error: "Server error." });
  }
});

router.post('/status', async (req, res) => {
  try {
    const { collectionAddress, nftId, status, owner, collectionName } = req.body;

    if (!collectionAddress || nftId === undefined || !status) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let collection = await NFTCollection.findOne({ collectionAddress });

    if (!collection) {
      if (!owner) {
        return res.status(400).json({ success: false, message: "Owner is required to create new collection" });
      }

      collection = new NFTCollection({
        collectionAddress,
        name: collectionName || "Untitled Collection",
        nfts: [],
      });
    }

    let nft = collection.nfts.find(n => n.nftId === nftId);

    if (!nft) {
      if (!owner) {
        return res.status(400).json({ success: false, message: "Owner is required to add new NFT" });
      }

      nft = { nftId, owner, status };
      collection.nfts.push(nft);
    } else {
      // Update status if NFT exists
      nft.status = status;
    }

    await collection.save();

    res.status(200).json({ success: true, message: "NFT status updated", data: nft });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// GET /nfts?collectionAddress=0x123...
router.get('/getNFTs', async (req, res) => {
  try {
    const { collectionAddress } = req.query;

    const collection = await NFTCollection.findOne({ collectionAddress });
    if (!collection) {
      return res.status(404).json({ success: false, message: "Collection not found" });
    }

    res.status(200).json({ success: true, data: collection.nfts });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// GET /nfts/status?collectionAddress=0x123&status=listed
router.get('/nfts/status', async (req, res) => {
  try {
    const { collectionAddress, status } = req.query;

    if (!collectionAddress || !status) {
      return res.status(400).json({ success: false, message: "Missing collectionAddress or status" });
    }

    const collection = await NFTCollection.findOne({ collectionAddress });
    if (!collection) {
      return res.status(404).json({ success: false, message: "Collection not found" });
    }

    const filtered = collection.nfts.filter(n => n.status === status);
    res.status(200).json({ success: true, data: filtered });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;