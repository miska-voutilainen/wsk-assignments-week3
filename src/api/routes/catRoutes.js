import express from 'express';
import {
  getAllCats,
  getCatById,
  addCat,
  updateCat,
  deleteCat,
} from '../controllers/catController.js';

const router = express.Router();

// GET /api/v1/cat - returns all cats
router.get('/', getAllCats);

// GET /api/v1/cat/:id - returns one cat by id
router.get('/:id', getCatById);

// POST /api/v1/cat - adds a new cat
router.post('/', addCat);

// PUT /api/v1/cat/:id - return hard coded json response
router.put('/:id', updateCat);

// DELETE /api/v1/cat/:id - return hard coded json response
router.delete('/:id', deleteCat);

export default router;
