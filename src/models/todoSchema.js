import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  fait: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Todo', TodoSchema);
