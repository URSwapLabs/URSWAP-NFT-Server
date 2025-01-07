const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)); // Dynamic fetch import

router.get('/', async (req, res) => {
    const imageUrl = req.query.url;

    if (!imageUrl) {
        return res.status(400).json({ error: 'Missing "url" query parameter' });
    }

    try {
        const response = await fetch(imageUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch image. Status: ${response.status}`);
        }

        const imageBuffer = await response.buffer();
        res.set('Content-Type', 'image/png');
        res.send(imageBuffer);
    } catch (err) {
        console.error('Error fetching image:', err.message);
        res.status(500).json({ error: 'Error fetching image', details: err.message });
    }
});

module.exports = router;