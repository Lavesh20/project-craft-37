
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  street: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: String },
  clientId: { type: String },
  isPrimaryContact: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);
