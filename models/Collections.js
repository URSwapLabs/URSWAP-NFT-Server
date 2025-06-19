const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    collectionAddress: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    imageURI: { type: String, required: true },
    type: { type: String, default: 'General' },
});

const collectionsSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true, unique: true },
    nftCollections: { type: [collectionSchema], default: [] }
});

const Collections = mongoose.model('Collections', collectionsSchema);

module.exports = Collections;