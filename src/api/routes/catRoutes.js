import express from 'express';
import multer from 'multer';
import { createThumbnail } from '../../middlewares/upload.js';
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
router.get('/user/:userId', getCatsByUserId);

// GET /api/v1/cat/:id - returns one cat by id
router.get('/:id', getCatById);

// POST /api/v1/cat - adds a new cat
router.post('/', upload.single('file'), createThumbnail, addCat);

// PUT /api/v1/cat/:id - return hard coded json response
router.put('/:id', updateCat);

// DELETE /api/v1/cat/:id - return hard coded json response
router.delete('/:id', deleteCat);

export default router;
