import {
  getAllUsers as getAllUsersModel,
  getUserById as getUserByIdModel,
  addUser as addUserModel,
  updateUser as updateUserModel,
  deleteUser as deleteUserModel,
} from '../models/userModel.js';

// GET /api/v1/user - returns all users
const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersModel();
    res.json(users);
  } catch (error) {
    console.error('Error in getAllUsers controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/v1/user/:id - returns one user by id
const getUserById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await getUserByIdModel(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error in getUserById controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /api/v1/user - adds a new user
const addUser = async (req, res) => {
  try {
    const newUser = await addUserModel(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error in addUser controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /api/v1/user/:id - updates a user
const updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await updateUserModel(id, req.body);

    if (!success) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error in updateUser controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /api/v1/user/:id - deletes a user and their cats
const deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await deleteUserModel(id);

    if (!success) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User and associated cats deleted successfully' });
  } catch (error) {
    console.error('Error in deleteUser controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { getAllUsers, getUserById, addUser, updateUser, deleteUser };
