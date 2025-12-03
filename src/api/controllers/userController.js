import bcrypt from 'bcrypt';
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

    // Don't send password back to client
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error in getUserById controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /api/v1/user - adds a new user
const addUser = async (req, res) => {
  try {
    // Hash the password before saving to database
    req.body.password = bcrypt.hashSync(req.body.password, 10);

    const newUser = await addUserModel(req.body);

    // Don't send password back to client
    const { password, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Error in addUser controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /api/v1/user/:id - updates a user (with authorization)
const updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const currentUser = res.locals.user;

    // Check authorization: users can only update their own data, admins can update anyone
    if (currentUser.user_id !== id && currentUser.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Forbidden: You can only update your own profile' });
    }

    // Hash password if it's being updated
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const success = await updateUserModel(id, req.body, currentUser);

    if (!success) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error in updateUser controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /api/v1/user/:id - deletes a user and their cats (with authorization)
const deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const currentUser = res.locals.user;

    // Check authorization: users can only delete their own account, admins can delete anyone
    if (currentUser.user_id !== id && currentUser.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Forbidden: You can only delete your own account' });
    }

    const success = await deleteUserModel(id, currentUser);

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
