import express from 'express';
import { authenticateToken } from '../../middlewares/authentication.js';
import {
  validateUser,
  validateUserUpdate,
  validateId,
} from '../../middlewares/validation.js';
import {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';

const router = express.Router();

// GET /api/v1/user - returns all users
router.get('/', getAllUsers);

// GET /api/v1/user/:id - returns one user by id
router.get('/:id', validateId, getUserById);

// POST /api/v1/user - adds a new user (public route for registration)
router.post('/', validateUser, addUser);

// PUT /api/v1/user/:id - updates a user (protected route)
router.put(
  '/:id',
  validateId,
  authenticateToken,
  validateUserUpdate,
  updateUser
);

// DELETE /api/v1/user/:id - deletes a user (protected route)
router.delete('/:id', validateId, authenticateToken, deleteUser);

export default router;
