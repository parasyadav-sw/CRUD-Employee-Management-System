const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/employee_management', {
      serverSelectionTimeoutMS: 2500, // 2.5s connection timeout for fast fallback
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB Connection Error: ${error.message}`);
    console.warn('Falling back to local JSON Database...');
    global.useJsonDb = true;
  }
};

module.exports = connectDB;
