const { default: mongoose } = require("mongoose");

const rewardSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true },
    type: { type: String, required: true },
    postLink: { type: String, required: true },
    status: { type: String, default: "pending" },
    createdAt: { type: Date, default: Date.now },
})

const Reward = mongoose.model('Reward', rewardSchema);
module.exports = Reward;