const express = require('express');
const cors = require('cors');  // Import the cors middleware

const app = express();

// Enable CORS for all origins (you can modify this for specific origins if necessary)
app.use(cors());  

// Use dynamic import for `node-fetch`
let fetch;
(async () => {
  fetch = (await import('node-fetch')).default;
})();

app.get('/proxy', async (req, res) => {
    const imageUrl = req.query.url;

    try {
        const response = await fetch(imageUrl);
        const imageBuffer = await response.buffer();
        res.set('Content-Type', 'image/png');
        res.send(imageBuffer);
    } catch (err) {
        res.status(500).send('Error fetching image');
    }
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});