const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true, unique: true },
    nftGenerations: { type: Number, default: 0 },
    imageURI: { type: String, default: "" },
    lastGeneratedAt: { type: Date, default: Date.now }
});

const Counter = mongoose.model('User', counterSchema);

module.exports = Counter;
