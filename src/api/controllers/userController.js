import { userItems } from '../models/userModel.js';

// GET /api/v1/user - returns all users
const getAllUsers = (req, res) => {
  res.json(userItems);
};

// GET /api/v1/user/:id - returns one user by id
const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  const user = userItems.find((user) => user.user_id === id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
};

// POST /api/v1/user - adds a new user
const addUser = (req, res) => {
  const newUser = {
    user_id: Math.max(...userItems.map((user) => user.user_id)) + 1,
    ...req.body,
  };

  userItems.push(newUser);
  res.status(201).json(newUser);
};

// PUT /api/v1/user/:id - return hard coded json response
const updateUser = (req, res) => {
  res.json({ message: 'User item updated.' });
};

// DELETE /api/v1/user/:id - return hard coded json response
const deleteUser = (req, res) => {
  res.json({ message: 'User item deleted.' });
};

export { getAllUsers, getUserById, addUser, updateUser, deleteUser };
