
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

// Improved CORS Configuration to accept requests from frontend (updated to include port 8081)
app.use(cors({
  origin: ['http://localhost:8081', 'http://127.0.0.1:8081'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // 24 hours in seconds
}));

// Parse JSON requests with increased size limit
app.use(express.json({ limit: '10mb' }));

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

// Enhanced logging middleware with more details for POST requests
app.use((req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  
  // Detailed logging for POST/PUT/PATCH requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    console.log(`[${timestamp}] Request Body:`, JSON.stringify(req.body, null, 2));
    console.log(`[${timestamp}] Content-Type:`, req.headers['content-type']);
    console.log(`[${timestamp}] Authorization:`, req.headers['authorization'] ? 'Present' : 'Not present');
    console.log(`[${timestamp}] Origin:`, req.headers['origin'] || 'No origin header');
  }
  
  // Add response logging
  const originalSend = res.send;
  res.send = function(body) {
    const duration = Date.now() - start;
    console.log(`[${timestamp}] Completed ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    
    // Log response for debugging
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      try {
        const responseBody = typeof body === 'string' ? JSON.parse(body) : body;
        console.log(`[${timestamp}] Response:`, JSON.stringify(responseBody, null, 2));
      } catch (e) {
        console.log(`[${timestamp}] Response: (non-JSON)`, body);
      }
    }
    
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
  console.log(`Frontend should be using http://localhost:8081 to connect`);
});
