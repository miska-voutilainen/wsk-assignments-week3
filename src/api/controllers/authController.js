import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AppError, catchAsync } from '../../middlewares/errorHandler.js';
import { findUserByUsername } from '../models/userModel.js';
import 'dotenv/config';

const postLogin = catchAsync(async (req, res, next) => {
  console.log('postLogin', req.body);

  const user = await findUserByUsername(req.body.username);
  if (!user) {
    return next(new AppError('Invalid username or password', 401));
  }

  const passwordMatch = await bcrypt.compare(req.body.password, user.password);
  if (!passwordMatch) {
    return next(new AppError('Invalid username or password', 401));
  }

  const userWithNoPassword = {
    user_id: user.user_id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(userWithNoPassword, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });

  res.json({
    status: 'success',
    data: {
      user: userWithNoPassword,
      token,
    },
  });
});

const getMe = catchAsync(async (req, res, next) => {
  console.log('getMe', res.locals.user);
  if (res.locals.user) {
    res.json({
      status: 'success',
      data: { user: res.locals.user },
    });
  } else {
    return next(new AppError('Unauthorized', 401));
  }
});

export { postLogin, getMe };
