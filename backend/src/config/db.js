import mongoose from 'mongoose';

export const connectDB = async (uri) => {
  try {
    if (!uri) throw new Error('MONGO_URI is missing');
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error', err.message);
    process.exit(1);
  }
};
