const express = require("express");
const Position = require("../models/Position");
const router = express.Router();
require("dotenv").config();

router.post("/addLiquidity", async (req, res) => {
    const { walletAddress, pairAddress, tokenA, tokenB, lpTokensAmount } = req.body;

    try {
        let position = await Position.findOne({ walletAddress });

        if (!position) {
            position = new Position({
                walletAddress,
                pairs: [{
                    pairAddress,
                    tokenA,
                    tokenB,
                    lpTokensAmount
                }]
            });
        } else {
            const existingPair = position.pairs.find(pair => pair.pairAddress === pairAddress);
            if (existingPair) {
                existingPair.lpTokensAmount += lpTokensAmount;
            } else {
                position.pairs.push({
                    pairAddress,
                    tokenA,
                    tokenB,
                    lpTokensAmount
                });
            }
        }

        // Save the position
        await position.save();
        res.status(200).json({ message: "Liquidity added successfully", position });
    } catch (error) {
        res.status(500).json({ message: "Error adding liquidity", error });
    }
});

router.post("/removeLiquidity", async (req, res) => {
    const { walletAddress, pairAddress, lpTokensAmount } = req.body;

    try {
        let position = await Position.findOne({ walletAddress });

        if (!position) {
            return res.status(404).json({ message: "Position not found" });
        }

        const pair = position.pairs.find(pair => pair.pairAddress === pairAddress);
        if (!pair) {
            return res.status(404).json({ message: "Pair not found in position" });
        }

        if (pair.lpTokensAmount <= lpTokensAmount) {
            position.pairs = position.pairs.filter(pair => pair.pairAddress !== pairAddress);
        } else {
            pair.lpTokensAmount -= lpTokensAmount;
        }

        if (position.pairs.length === 0) {
            await Position.deleteOne({ walletAddress });
            return res.status(200).json({ message: "All liquidity removed, position deleted" });
        }

        await position.save();
        res.status(200).json({ message: "Liquidity removed successfully", position });
    } catch (error) {
        res.status(500).json({ message: "Error removing liquidity", error });
    }
});

router.get("/getPosition/:walletAddress", async (req, res) => {
    const { walletAddress } = req.params;

    try {
        const position = await Position.findOne({ walletAddress });

        if (!position) {
            return res.status(404).json({ message: "Position not found" });
        }

        res.status(200).json(position);
    } catch (error) {
        res.status(500).json({ message: "Error fetching position", error });
    }
});


module.exports = router;