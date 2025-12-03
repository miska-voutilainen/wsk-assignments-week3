import express from 'express';
import cors from 'cors';
import catRoutes from './api/routes/catRoutes.js';
import userRoutes from './api/routes/userRoutes.js';
import authRoutes from './api/routes/authRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json({ limit: '10mb' })); // Add size limit for security

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

// Handle 404 errors
app.all('*', (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  next(err);
});

// Global error handling middleware (must be last)
app.use(errorHandler);

export default app;
