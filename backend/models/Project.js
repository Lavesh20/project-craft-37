
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, required: true, default: 'Not Started' },
  dueDate: { type: Date, required: true },
  position: { type: Number, default: 0 },
  assigneeId: { type: String },
  lastEdited: { type: Date, default: Date.now }
});

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  clientId: { type: String },
  status: { type: String, required: true, default: 'Not Started' },
  dueDate: { type: Date, required: true },
  startDate: { type: Date },
  assigneeId: { type: String },
  teamMemberIds: [{ type: String }],
  tasks: [taskSchema],
  templateId: { type: String },
  repeating: { type: Boolean, default: false },
  labels: [{ type: String }],
  frequency: { type: String, enum: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly', 'Custom'] },
  lastEdited: { type: Date, default: Date.now },
  lastEditedBy: { type: String }
});

module.exports = mongoose.model('Project', projectSchema);
