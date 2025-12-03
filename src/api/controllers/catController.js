import { AppError, catchAsync } from '../../middlewares/errorHandler.js';
import {
  getAllCats as getAllCatsModel,
  getCatById as getCatByIdModel,
  getCatsByUserId as getCatsByUserIdModel,
  addCat as addCatModel,
  updateCat as updateCatModel,
  deleteCat as deleteCatModel,
} from '../models/catModel.js';

// GET /api/v1/cat - returns all cats with owner names
const getAllCats = catchAsync(async (req, res) => {
  const cats = await getAllCatsModel();
  res.json({
    status: 'success',
    results: cats.length,
    data: { cats },
  });
});

// GET /api/v1/cat/:id - returns one cat by id with owner name
const getCatById = catchAsync(async (req, res, next) => {
  const id = parseInt(req.params.id);
  const cat = await getCatByIdModel(id);

  if (!cat) {
    return next(new AppError('Cat not found', 404));
  }

  res.json({
    status: 'success',
    data: { cat },
  });
});

// GET /api/v1/cat/user/:userId - returns cats by user id
const getCatsByUserId = catchAsync(async (req, res) => {
  const userId = parseInt(req.params.userId);
  const cats = await getCatsByUserIdModel(userId);
  res.json({
    status: 'success',
    results: cats.length,
    data: { cats },
  });
});

// POST /api/v1/cat - adds a new cat
const addCat = catchAsync(async (req, res) => {
  console.log('Form data (req.body):', req.body);
  console.log('File data (req.file):', req.file);

  const catData = { ...req.body };

  // Map 'name' field to 'cat_name' for database compatibility
  if (catData.name) {
    catData.cat_name = catData.name;
    delete catData.name;
  }

  if (req.file) {
    catData.filename = req.file.filename;
  }

  const newCat = await addCatModel(catData);
  res.status(201).json({
    status: 'success',
    data: { cat: newCat },
  });
});

// PUT /api/v1/cat/:id - updates a cat (with authorization)
const updateCat = catchAsync(async (req, res, next) => {
  const id = parseInt(req.params.id);
  const catData = { ...req.body };
  const currentUser = res.locals.user;

  // Map 'name' field to 'cat_name' for database compatibility
  if (catData.name) {
    catData.cat_name = catData.name;
    delete catData.name;
  }

  const success = await updateCatModel(id, catData, currentUser);

  if (!success) {
    return next(new AppError('Cat not found or unauthorized', 404));
  }

  res.json({
    status: 'success',
    message: 'Cat updated successfully',
  });
});

// DELETE /api/v1/cat/:id - deletes a cat (with authorization)
const deleteCat = catchAsync(async (req, res, next) => {
  const id = parseInt(req.params.id);
  const currentUser = res.locals.user;

  const success = await deleteCatModel(id, currentUser);

  if (!success) {
    return next(new AppError('Cat not found or unauthorized', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export {
  getAllCats,
  getCatById,
  getCatsByUserId,
  addCat,
  updateCat,
  deleteCat,
};
