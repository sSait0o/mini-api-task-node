import mongoose from 'mongoose';
import TodoSchema from '../src/models/todoSchema.js';

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/todolist';

async function run() {
  await mongoose.connect(url);
  const doc = await TodoSchema.create({ titre: 'Seed Mongo test' });
  console.log('Inserted into Mongo:', { id: doc._id, titre: doc.titre, fait: doc.fait });
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Mongo seed failed:', err.message || err);
  process.exit(1);
});
