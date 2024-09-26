const mongoose = require('mongoose');
const URI = process.env.MONGODB_URI;


const connectDB = async () => {
    try {
        await mongoose.connect(URI);
        console.log('MongoDB connection SUCCESS');
    } catch (error) {
        console.error('MongoDB connection FAIL', error.message);
        process.exit(1);
    }
};


module.exports = connectDB;