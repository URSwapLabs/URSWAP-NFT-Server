const mongoose = require('mongoose');

const socialSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    userName: { type: String },
    displayName: { type: String },
    userIcon: { type: String },
}, { _id: false });

const userSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true, unique: true },
    name: { type: String },
    imageURI: { type: String },
    email: { type: String },
    socials: {
        discord: { type: socialSchema, default: () => ({}) },
        twitter: { type: socialSchema, default: () => ({}) },
        telegram: { type: socialSchema, default: () => ({}) },
        youtube: { type: socialSchema, default: () => ({}) },
        tiktok: { type: socialSchema, default: () => ({}) },
        instagram: { type: socialSchema, default: () => ({}) },
        pinterest: { type: socialSchema, default: () => ({}) },
        thread: { type: socialSchema, default: () => ({}) },
    }
});

const User = mongoose.model('UserProfile', userSchema);
module.exports = User;