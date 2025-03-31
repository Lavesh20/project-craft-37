
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  authorId: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
