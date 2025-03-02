const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    collectionAddress: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    imageURI: { type: String, required: true }
});

const counterSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true, unique: true },
    nftCollections: { type: [collectionSchema], default: [] } // Array of unique collections
});

const Counter = mongoose.model('Collections', counterSchema);

module.exports = Counter;