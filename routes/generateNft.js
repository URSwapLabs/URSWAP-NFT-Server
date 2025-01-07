const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.post('/', async (req, res) => {
    const { imagePrompt } = req.body;

    if (!imagePrompt) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = `${imagePrompt}`;

    try {
        const response = await openai.images.generate({
            model: 'dall-e-3',
            prompt: prompt,
            n: 1,
            size: '1024x1024',
        });

        if (!response.data) {
            throw new Error('Failed to generate image');
        }

        console.log('Generated image:', response.data[0].url);

        res.status(200).json({
            data: response.data,
        });
    } catch (error) {
        console.error('Error generating image:', error.message);
        res.status(500).json({
            error: 'Failed to generate image due to internal server error',
        });
    }
});

module.exports = router;