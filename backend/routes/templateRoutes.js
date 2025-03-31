
const express = require('express');
const router = express.Router();
const Template = require('../models/Template');

// Get all templates
router.get('/', async (req, res) => {
  try {
    const templates = await Template.find();
    res.json(templates);
  } catch (err) {
    console.error('Error fetching templates:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get template by ID
router.get('/:id', async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json(template);
  } catch (err) {
    console.error('Error fetching template by ID:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create template
router.post('/', async (req, res) => {
  const template = new Template({
    name: req.body.name,
    description: req.body.description,
    tasks: req.body.tasks || [],
    category: req.body.category,
    clientIds: req.body.clientIds || [],
    teamMemberIds: req.body.teamMemberIds || []
  });

  try {
    const newTemplate = await template.save();
    res.status(201).json(newTemplate);
  } catch (err) {
    console.error('Error creating template:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update template
router.patch('/:id', async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    
    if (req.body.name) template.name = req.body.name;
    if (req.body.description !== undefined) template.description = req.body.description;
    if (req.body.tasks) template.tasks = req.body.tasks;
    if (req.body.category) template.category = req.body.category;
    if (req.body.clientIds) template.clientIds = req.body.clientIds;
    if (req.body.teamMemberIds) template.teamMemberIds = req.body.teamMemberIds;
    
    template.lastEdited = Date.now();
    
    const updatedTemplate = await template.save();
    res.json(updatedTemplate);
  } catch (err) {
    console.error('Error updating template:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete template
router.delete('/:id', async (req, res) => {
  try {
    const result = await Template.findByIdAndDelete(req.params.id);
    
    if (!result) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    res.json({ message: 'Template deleted' });
  } catch (err) {
    console.error('Error deleting template:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
