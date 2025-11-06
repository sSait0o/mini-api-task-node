import mongoose from 'mongoose';

export async function connect(uri) {
  if (!uri) {
    console.warn('MONGODB_URI not set - running with in-memory storage');
    return null;
  }
  try {
    await mongoose.connect(uri, {});
    console.log('MongoDB connected');
    return mongoose.connection;
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
    throw err;
  }
}

export { mongoose };
