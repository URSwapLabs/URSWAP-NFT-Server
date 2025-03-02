const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    tokenAddress: { type: String },
    tokenName: { type: String, required: true },
    tokenSymbol: { type: String, required: true },
    imageURL: { type: String, required: true },
    amount: { type: Number, required: true, default: 0 }
})

const pairSchema = new mongoose.Schema({
    pairAddress: { type: String, required: true, unique: true },
    tokenA: { type: {tokenSchema}, required: true, default: [] },
    tokenB: { type: {tokenSchema}, required: true, default: [] },
    lpTokensAmount: { type: Number, required: true, default: 0 }
})

const positionSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true, unique: true },
    pairs: { type: {pairSchema}, default: [] }
});

const Position = mongoose.model('Positions', positionSchema);

module.exports = Position;
