const mongoose = require('mongoose');
require('dotenv').config()
const dbURI =process.env.MONGO_URL

// 2️⃣ Create a function to connect to MongoDB
const connectDB = async () => {
  try {
    // connect using MONGO_URI from .env file
    console.log(process.env.MONGO_URI)
    await mongoose.connect(process.env.MONGO_URI);

    console.log("🍃🍃 Connected to MongoDB 🍃🍃");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // stop the app if DB connection fails
  }
};

// 3️⃣ Export the function
module.exports = connectDB;