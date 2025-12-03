import { catItems } from '../models/catModel.js';

// GET /api/v1/cat - returns all cats
const getAllCats = (req, res) => {
  res.json(catItems);
};

// GET /api/v1/cat/:id - returns one cat by id
const getCatById = (req, res) => {
  const id = parseInt(req.params.id);
  const cat = catItems.find((cat) => cat.cat_id === id);

  if (!cat) {
    return res.status(404).json({ message: 'Cat not found' });
  }

  res.json(cat);
};

// POST /api/v1/cat - adds a new cat
const addCat = (req, res) => {
  console.log('Form data (req.body):', req.body);
  console.log('File data (req.file):', req.file);

  const newCat = {
    cat_id: Math.max(...catItems.map((cat) => cat.cat_id)) + 1,
    ...req.body,
  };

  if (req.file) {
    newCat.filename = req.file.filename;
  }

  catItems.push(newCat);
  res.status(201).json(newCat);
};

// PUT /api/v1/cat/:id - return hard coded json response
const updateCat = (req, res) => {
  res.json({ message: 'Cat item updated.' });
};

// DELETE /api/v1/cat/:id - return hard coded json response
const deleteCat = (req, res) => {
  res.json({ message: 'Cat item deleted.' });
};

export { getAllCats, getCatById, addCat, updateCat, deleteCat };
