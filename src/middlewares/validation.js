import { body, param, validationResult } from 'express-validator';
import { AppError } from './errorHandler.js';

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((error) => `${error.path}: ${error.msg}`);
    return next(
      new AppError(`Validation failed: ${errorMessages.join(', ')}`, 400)
    );
  }
  next();
};

// User validation rules
const validateUser = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),

  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),

  handleValidationErrors,
];

// User update validation (password is optional)
const validateUserUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),

  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),

  handleValidationErrors,
];

// Cat validation rules
const validateCat = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Cat name must be between 1 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Cat name can only contain letters and spaces'),

  body('weight')
    .isFloat({ min: 0.1, max: 50 })
    .withMessage('Weight must be a number between 0.1 and 50 kg'),

  body('owner').isInt({ min: 1 }).withMessage('Owner must be a valid user ID'),

  body('birthdate')
    .isDate()
    .withMessage('Birthdate must be a valid date (YYYY-MM-DD)')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      if (birthDate > today) {
        throw new Error('Birthdate cannot be in the future');
      }
      return true;
    }),

  handleValidationErrors,
];

// Cat update validation (all fields optional)
const validateCatUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Cat name must be between 1 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Cat name can only contain letters and spaces'),

  body('weight')
    .optional()
    .isFloat({ min: 0.1, max: 50 })
    .withMessage('Weight must be a number between 0.1 and 50 kg'),

  body('owner')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Owner must be a valid user ID'),

  body('birthdate')
    .optional()
    .isDate()
    .withMessage('Birthdate must be a valid date (YYYY-MM-DD)')
    .custom((value) => {
      if (value) {
        const birthDate = new Date(value);
        const today = new Date();
        if (birthDate > today) {
          throw new Error('Birthdate cannot be in the future');
        }
      }
      return true;
    }),

  handleValidationErrors,
];

// Login validation
const validateLogin = [
  body('username').trim().notEmpty().withMessage('Username is required'),

  body('password').notEmpty().withMessage('Password is required'),

  handleValidationErrors,
];

// ID parameter validation
const validateId = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),

  handleValidationErrors,
];

const validateUserId = [
  param('userId')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),

  handleValidationErrors,
];

export {
  validateUser,
  validateUserUpdate,
  validateCat,
  validateCatUpdate,
  validateLogin,
  validateId,
  validateUserId,
  handleValidationErrors,
};
