
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Get all tasks across all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    const allTasks = projects.flatMap(project => 
      (project.tasks || []).map(task => ({
        ...task.toObject(),
        projectId: project._id,
        projectName: project.name,
        clientId: project.clientId
      }))
    );
    res.json(allTasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a task for a project
router.post('/:projectId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    if (!project.tasks) {
      project.tasks = [];
    }
    
    // Calculate position based on existing tasks
    const position = project.tasks.length > 0 
      ? Math.max(...project.tasks.map(t => t.position)) + 1 
      : 0;
    
    const newTask = {
      name: req.body.name,
      description: req.body.description,
      status: 'Not Started',
      dueDate: req.body.dueDate,
      assigneeId: req.body.assigneeId,
      position: position,
      lastEdited: Date.now()
    };
    
    project.tasks.push(newTask);
    project.lastEdited = Date.now();
    
    const updatedProject = await project.save();
    const addedTask = updatedProject.tasks[updatedProject.tasks.length - 1];
    
    res.status(201).json(addedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a task
router.patch('/:projectId/:taskId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    const taskIndex = project.tasks.findIndex(t => t._id.toString() === req.params.taskId);
    if (taskIndex === -1) return res.status(404).json({ message: 'Task not found' });
    
    // Update task fields
    Object.keys(req.body).forEach(key => {
      if (key !== '_id' && key !== '__v') {
        project.tasks[taskIndex][key] = req.body[key];
      }
    });
    
    project.tasks[taskIndex].lastEdited = Date.now();
    project.lastEdited = Date.now();
    
    const updatedProject = await project.save();
    res.json(updatedProject.tasks[taskIndex]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a task
router.delete('/:projectId/:taskId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    const taskIndex = project.tasks.findIndex(t => t._id.toString() === req.params.taskId);
    if (taskIndex === -1) return res.status(404).json({ message: 'Task not found' });
    
    project.tasks.splice(taskIndex, 1);
    project.lastEdited = Date.now();
    
    await project.save();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get tasks by status
router.get('/status/:status', async (req, res) => {
  try {
    const projects = await Project.find();
    const tasksByStatus = projects.flatMap(project => 
      (project.tasks || [])
        .filter(task => task.status === req.params.status)
        .map(task => ({
          ...task.toObject(),
          projectId: project._id,
          projectName: project.name,
          clientId: project.clientId
        }))
    );
    res.json(tasksByStatus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
