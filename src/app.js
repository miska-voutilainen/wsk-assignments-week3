import express from 'express';
import cors from 'cors';
import catRoutes from './api/routes/catRoutes.js';
import userRoutes from './api/routes/userRoutes.js';
import authRoutes from './api/routes/authRoutes.js';

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Serve static files from public folder
app.use('/public', express.static('public'));

// Hello world route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// API routes
app.use('/api/v1/cat', catRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/auth', authRoutes);

export default app;
