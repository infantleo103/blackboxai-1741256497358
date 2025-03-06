const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  try {
    if (process.env.NODE_ENV === 'production') {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB Connected');
    } else {
      // Use in-memory database for development
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('MongoDB Memory Server Connected');
    }
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  } catch (err) {
    console.error('MongoDB disconnection error:', err);
  }
};

module.exports = { connectDB, disconnectDB };
