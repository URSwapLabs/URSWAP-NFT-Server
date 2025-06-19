const Collections = require('../models/Collections');
const connectDb = require('../db');

connectDb();

(async () => {
    try {
        console.log('Connected to MongoDB');
        const collections = await Collections.find({});

        for (const collection of collections) {
            let updated = false;

            collection.nftCollections.forEach((collection) => {
                if (!collection.type) {
                    collection.type = 'General';
                    updated = true;
                }
            });

            if (updated) {
                await collection.save();
                console.log(`Updated collection for wallet: ${collection.walletAddress}`);
            }
        }

        console.log('All documents updated successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error updating documents:', error);
        process.exit(1);
    }
})();