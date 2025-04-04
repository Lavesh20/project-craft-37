
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create project
router.post('/', async (req, res) => {
  const project = new Project({
    name: req.body.name,
    description: req.body.description,
    clientId: req.body.clientId,
    status: req.body.status || 'Not Started',
    dueDate: req.body.dueDate,
    startDate: req.body.startDate,
    assigneeId: req.body.assigneeId,
    teamMemberIds: req.body.teamMemberIds || [],
    tasks: req.body.tasks || [],
    templateId: req.body.templateId,
    repeating: req.body.repeating,
    labels: req.body.labels,
    frequency: req.body.frequency,
    lastEditedBy: req.body.lastEditedBy
  });

  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update project
router.patch('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Update fields if present in request
    Object.keys(req.body).forEach(key => {
      if (key !== '_id' && key !== '__v') {
        project[key] = req.body[key];
      }
    });
    
    project.lastEdited = Date.now();
    
    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get projects by client ID
router.get('/client/:clientId', async (req, res) => {
  try {
    const projects = await Project.find({ clientId: req.params.clientId });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
