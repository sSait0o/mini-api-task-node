const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  fait: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Todo', TodoSchema);
