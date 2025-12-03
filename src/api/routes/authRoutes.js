import express from 'express';
import { getMe, postLogin } from '../controllers/authController.js';
import { authenticateToken } from '../../middlewares/authentication.js';
import { validateLogin } from '../../middlewares/validation.js';

const router = express.Router();

// POST /api/v1/auth/login - login user
router.post('/login', validateLogin, postLogin);

// GET /api/v1/auth/me - get current user info (protected route)
router.get('/me', authenticateToken, getMe);

export default router;
