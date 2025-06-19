const mongoose = require("mongoose");

const nftSchema = new mongoose.Schema({
  nftId: { type: Number, required: true },
  owner: { type: String, required: true },
  status: {
    type: String,
    enum: ["minted", "listed", "auctioned", "sold", "burned", "transferred"],
    default: "minted",
  },
  startTime: { type: String, default: null },
  endTime: { type: String, default: null }
}, { _id: false });

const nftCollectionSchema = new mongoose.Schema({
  collectionName: { type: String, required: true },
  collectionAddress: { type: String, required: true, unique: true },
  nfts: [nftSchema]
}, { timestamps: true });

const NFTCollection = mongoose.model("NFTCollection", nftCollectionSchema);

module.exports = NFTCollection;
