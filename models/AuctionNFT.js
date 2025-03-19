const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema({
    collectionAddress: { type: String, required: true },
    creatorAddress: { type: String, required: true },
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    imageURI: { type: String, required: true },
    auctionId: { type: String, required: true },
    bidAmount: { type: Number, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
});

const auctionSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true, unique: true },
    NFTs: { type: [nftSchema], default: [] }
});

const AuctionNFT = mongoose.model('AuctionNFT', auctionSchema);

module.exports = AuctionNFT;