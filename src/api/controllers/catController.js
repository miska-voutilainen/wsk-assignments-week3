import {
  getAllCats as getAllCatsModel,
  getCatById as getCatByIdModel,
  getCatsByUserId as getCatsByUserIdModel,
  addCat as addCatModel,
  updateCat as updateCatModel,
  deleteCat as deleteCatModel,
} from '../models/catModel.js';

// GET /api/v1/cat - returns all cats with owner names
const getAllCats = async (req, res) => {
  try {
    const cats = await getAllCatsModel();
    res.json(cats);
  } catch (error) {
    console.error('Error in getAllCats controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/v1/cat/:id - returns one cat by id with owner name
const getCatById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const cat = await getCatByIdModel(id);

    if (!cat) {
      return res.status(404).json({ message: 'Cat not found' });
    }

    res.json(cat);
  } catch (error) {
    console.error('Error in getCatById controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/v1/cat/user/:userId - returns cats by user id
const getCatsByUserId = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const cats = await getCatsByUserIdModel(userId);
    res.json(cats);
  } catch (error) {
    console.error('Error in getCatsByUserId controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /api/v1/cat - adds a new cat
const addCat = async (req, res) => {
  try {
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
    res.status(201).json(newCat);
  } catch (error) {
    console.error('Error in addCat controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /api/v1/cat/:id - updates a cat (with authorization)
const updateCat = async (req, res) => {
  try {
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
      return res.status(404).json({ message: 'Cat not found or unauthorized' });
    }

    res.json({ message: 'Cat updated successfully' });
  } catch (error) {
    console.error('Error in updateCat controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /api/v1/cat/:id - deletes a cat (with authorization)
const deleteCat = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const currentUser = res.locals.user;

    const success = await deleteCatModel(id, currentUser);

    if (!success) {
      return res.status(404).json({ message: 'Cat not found or unauthorized' });
    }

    res.json({ message: 'Cat deleted successfully' });
  } catch (error) {
    console.error('Error in deleteCat controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  getAllCats,
  getCatById,
  getCatsByUserId,
  addCat,
  updateCat,
  deleteCat,
};
