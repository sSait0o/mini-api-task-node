import mongoose from 'mongoose';
import User from '../src/models/userSchema.js';
import bcrypt from 'bcryptjs';

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/todolist';

async function run() {
  await mongoose.connect(url);
  const email = 'seeduser@example.com';
  const existing = await User.findOne({ email }).lean();
  if (existing) {
    console.log('Seed user already exists:', existing.email);
    await mongoose.disconnect();
    return;
  }
  const hash = await bcrypt.hash('password', 10);
  const user = await User.create({ email, password: hash, name: 'Seed User' });
  console.log('Inserted seed user into Mongo:', { id: user._id, email: user.email });
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Mongo seed failed:', err.message || err);
  process.exit(1);
});
