
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  website: { type: String },
  assigneeId: { type: String },
  priority: { 
    type: String, 
    enum: ['None', 'Low', 'Medium', 'High'],
    default: 'None'
  },
  services: [{ type: String }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastEdited: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Client', clientSchema);
