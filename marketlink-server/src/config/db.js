import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  // Already connected or connecting
  if (mongoose.connection.readyState !== 0) {
    return true;
  }

  try {
    const conn = await mongoose.connect(MONGO_URI.trim(), {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 20000,
      family: 4,
      maxPoolSize: 10,
    });

    console.log(`MongoDB connected successfully!!!!!!!!!`);

    return true;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    setTimeout(connectDB, 5000);

    return false;
  }
};

export default connectDB;
