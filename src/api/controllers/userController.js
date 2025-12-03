import bcrypt from 'bcrypt';
import { AppError, catchAsync } from '../../middlewares/errorHandler.js';
import {
  getAllUsers as getAllUsersModel,
  getUserById as getUserByIdModel,
  addUser as addUserModel,
  updateUser as updateUserModel,
  deleteUser as deleteUserModel,
} from '../models/userModel.js';

// GET /api/v1/user - returns all users
const getAllUsers = catchAsync(async (req, res) => {
  const users = await getAllUsersModel();
  res.json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

// GET /api/v1/user/:id - returns one user by id
const getUserById = catchAsync(async (req, res, next) => {
  const id = parseInt(req.params.id);
  const user = await getUserByIdModel(id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Don't send password back to client
  const { password, ...userWithoutPassword } = user;
  res.json({
    status: 'success',
    data: { user: userWithoutPassword },
  });
});

// POST /api/v1/user - adds a new user
const addUser = catchAsync(async (req, res) => {
  // Hash the password before saving to database
  req.body.password = bcrypt.hashSync(req.body.password, 10);

  const newUser = await addUserModel(req.body);

  // Don't send password back to client
  const { password, ...userWithoutPassword } = newUser;
  res.status(201).json({
    status: 'success',
    data: { user: userWithoutPassword },
  });
});

// PUT /api/v1/user/:id - updates a user (with authorization)
const updateUser = catchAsync(async (req, res, next) => {
  const id = parseInt(req.params.id);
  const currentUser = res.locals.user;

  // Check authorization: users can only update their own data, admins can update anyone
  if (currentUser.user_id !== id && currentUser.role !== 'admin') {
    return next(
      new AppError('Forbidden: You can only update your own profile', 403)
    );
  }

  // Hash password if it's being updated
  if (req.body.password) {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }

  const success = await updateUserModel(id, req.body, currentUser);

  if (!success) {
    return next(new AppError('User not found', 404));
  }

  res.json({
    status: 'success',
    message: 'User updated successfully',
  });
});

// DELETE /api/v1/user/:id - deletes a user and their cats (with authorization)
const deleteUser = catchAsync(async (req, res, next) => {
  const id = parseInt(req.params.id);
  const currentUser = res.locals.user;

  // Check authorization: users can only delete their own account, admins can delete anyone
  if (currentUser.user_id !== id && currentUser.role !== 'admin') {
    return next(
      new AppError('Forbidden: You can only delete your own account', 403)
    );
  }

  const success = await deleteUserModel(id, currentUser);

  if (!success) {
    return next(new AppError('User not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export { getAllUsers, getUserById, addUser, updateUser, deleteUser };
