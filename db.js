const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('MongoDB Connected:', conn.connection.host);
    } catch (error) {
        console.log("MongoDB connection error: ", error);
        process.exit(1);
    }
}

module.exports = connectDb