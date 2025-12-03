import express from 'express';
import multer from 'multer';
import { createThumbnail } from '../../middlewares/upload.js';
import { authenticateToken } from '../../middlewares/authentication.js';
import {
  validateCat,
  validateCatUpdate,
  validateId,
  validateUserId,
} from '../../middlewares/validation.js';
import {
  getAllCats,
  getCatById,
  getCatsByUserId,
  addCat,
  updateCat,
  deleteCat,
} from '../controllers/catController.js';

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// GET /api/v1/cat - returns all cats
router.get('/', getAllCats);

// GET /api/v1/cat/user/:userId - returns cats by user id
router.get('/user/:userId', validateUserId, getCatsByUserId);

// GET /api/v1/cat/:id - returns one cat by id
router.get('/:id', validateId, getCatById);

// POST /api/v1/cat - adds a new cat (protected route)
router.post(
  '/',
  authenticateToken,
  upload.single('file'),
  createThumbnail,
  validateCat,
  addCat
);

// PUT /api/v1/cat/:id - updates a cat (protected route)
router.put('/:id', validateId, authenticateToken, validateCatUpdate, updateCat);

// DELETE /api/v1/cat/:id - deletes a cat (protected route)
router.delete('/:id', validateId, authenticateToken, deleteCat);

export default router;
