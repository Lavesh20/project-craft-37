
const mongoose = require('mongoose');

const templateTaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  position: { type: Number, default: 0 },
  relativeDueDate: {
    value: { type: Number, required: true },
    unit: { type: String, enum: ['days', 'weeks', 'months'], required: true },
    position: { type: String, enum: ['before', 'after'], required: true }
  },
  timeEstimate: {
    value: { type: Number, required: true },
    unit: { type: String, enum: ['m', 'h'], required: true }
  },
  assigneeId: { type: String }
});

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  tasks: [templateTaskSchema],
  category: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastEdited: { type: Date, default: Date.now },
  clientIds: [{ type: String }],
  teamMemberIds: [{ type: String }]
});

module.exports = mongoose.model('Template', templateSchema);
