const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/download-image", async (req, res) => {
    const imageUrl = req.query.url;
    if (!imageUrl) {
        return res.status(400).send("Missing image URL");
    }

    try {
        const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
        const contentType = response.headers["content-type"] || "image/png";
        res.setHeader("Content-Type", contentType);
        res.setHeader("Content-Disposition", "attachment; filename=generated-image.png");
        res.send(response.data);
    } catch (error) {
        console.error("Failed to fetch image:", error.message);
        res.status(500).send("Failed to download image");
    }
});

module.exports = router;