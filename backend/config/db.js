const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log("🚀 ~ connectDB ~ process.env.MONGODB_URI:", process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected Successfully');
    } catch (err) {
        console.error('❌ Database connection error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;