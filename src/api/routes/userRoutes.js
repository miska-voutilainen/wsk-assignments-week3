import express from 'express';
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
router.get('/:id', getUserById);

// POST /api/v1/user - adds a new user
router.post('/', addUser);

// PUT /api/v1/user/:id - return hard coded json response
router.put('/:id', updateUser);

// DELETE /api/v1/user/:id - return hard coded json response
router.delete('/:id', deleteUser);

export default router;
