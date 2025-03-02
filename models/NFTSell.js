const mongoose = require('mongoose');

const NFTSellSchema = new mongoose.Schema({
    collectionAddress: { type: String, required: true },
    seller: { type: String, required: true },
    nfts: [
        {
            nftId: { type: Number, required: true },
            minPrice: { type: Number, required: true },
            selloutPrice: { type: Number, required: true },
            startTime: { type: Number, required: true },
            endTime: { type: Number, required: true },
            isReserved: { type: Boolean, default: false },
            status: { 
                type: String, 
                enum: ["listed", "sold", "canceled"], 
                default: "listed" 
            },
            currentOwner: { type: String },
            buyer: { type: String, default: null },
        }
    ]
}, { timestamps: true });

const NFTSell = mongoose.model('NFTSell', NFTSellSchema);

module.exports = NFTSell;