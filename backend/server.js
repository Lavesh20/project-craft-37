
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const templateRoutes = require('./routes/templateRoutes');
const projectRoutes = require('./routes/projectRoutes');
const clientRoutes = require('./routes/clientRoutes');
const contactRoutes = require('./routes/contactRoutes');
const taskRoutes = require('./routes/taskRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Improved CORS Configuration to accept requests from frontend
app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://localhost:8081', 'http://127.0.0.1:8081'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // 24 hours in seconds
}));

// Parse JSON requests
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    console.log('Database connection successful');
    console.log(`MongoDB URL: ${process.env.MONGODB_URL}`);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('Make sure your MongoDB server is running and MONGODB_URL is correct in .env');
  });

// Enhanced logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  
  // Log request body for POST/PUT/PATCH requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    console.log('Request Body:', JSON.stringify(req.body));
  }
  
  // Add response logging
  const originalSend = res.send;
  res.send = function(body) {
    const duration = Date.now() - start;
    console.log(`${new Date().toISOString()} - Completed ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    return originalSend.call(this, body);
  };
  
  next();
});

// Routes
app.use('/api/templates', templateRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/auth', authRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('JetPack Workflow API is running');
});

// Test route to verify API is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working correctly', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
