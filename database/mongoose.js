const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mobileApp";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      // Mongoose 6+ uses sensible defaults; specify helpful options instead
      serverSelectionTimeoutMS: 10000, // 10s timeout for initial server selection
      family: 4, // use IPv4 to avoid potential IPv6 resolution/connect issues
    });
    console.log(`Mongoose connected to ${mongoURI}`);
  } catch (err) {
    console.error('Mongoose connection error:', err);
    process.exit(1); 
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDB;
