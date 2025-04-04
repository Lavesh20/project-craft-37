
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Get all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get contact by ID
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create contact
router.post('/', async (req, res) => {
  // If this is a primary contact for a client, update other contacts to not be primary
  if (req.body.clientId && req.body.isPrimaryContact) {
    try {
      await Contact.updateMany(
        { clientId: req.body.clientId, isPrimaryContact: true },
        { isPrimaryContact: false }
      );
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  const contact = new Contact({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    street: req.body.street,
    city: req.body.city,
    state: req.body.state,
    postalCode: req.body.postalCode,
    clientId: req.body.clientId,
    isPrimaryContact: req.body.isPrimaryContact || false
  });

  try {
    const newContact = await contact.save();
    res.status(201).json(newContact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update contact
router.patch('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    
    // If making this a primary contact, update other contacts for the client
    if (req.body.clientId && req.body.isPrimaryContact) {
      await Contact.updateMany(
        { 
          _id: { $ne: req.params.id }, 
          clientId: req.body.clientId, 
          isPrimaryContact: true 
        },
        { isPrimaryContact: false }
      );
    }
    
    // Update fields if present in request
    Object.keys(req.body).forEach(key => {
      if (key !== '_id' && key !== '__v') {
        contact[key] = req.body[key];
      }
    });
    
    const updatedContact = await contact.save();
    res.json(updatedContact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete contact
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get contacts by client ID
router.get('/client/:clientId', async (req, res) => {
  try {
    const contacts = await Contact.find({ clientId: req.params.clientId });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
