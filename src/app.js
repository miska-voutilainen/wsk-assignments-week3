import express from 'express';
import catRoutes from './api/routes/catRoutes.js';
import userRoutes from './api/routes/userRoutes.js';

const app = express();

// Middleware
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

export default app;
