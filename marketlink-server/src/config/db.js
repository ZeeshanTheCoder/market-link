import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  // Already connected
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // Already connecting
  if (mongoose.connection.readyState === 2) {
    await mongoose.connection.asPromise();
    return;
  }

  await mongoose.connect(MONGO_URI.trim(), {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 20000,
    family: 4,
    maxPoolSize: 10,
  });

  console.log("MongoDB connected successfully");
};

export default connectDB;
