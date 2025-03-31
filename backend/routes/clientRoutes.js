
const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get client by ID
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create client
router.post('/', async (req, res) => {
  const client = new Client({
    name: req.body.name,
    description: req.body.description,
    location: req.body.location,
    website: req.body.website,
    assigneeId: req.body.assigneeId,
    priority: req.body.priority || 'None',
    services: req.body.services || [],
    isActive: req.body.isActive !== undefined ? req.body.isActive : true
  });

  try {
    const newClient = await client.save();
    res.status(201).json(newClient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update client
router.patch('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    
    // Update fields if present in request
    Object.keys(req.body).forEach(key => {
      if (key !== '_id' && key !== '__v') {
        client[key] = req.body[key];
      }
    });
    
    client.lastEdited = Date.now();
    
    const updatedClient = await client.save();
    res.json(updatedClient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete client
router.delete('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    
    await client.remove();
    res.json({ message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
