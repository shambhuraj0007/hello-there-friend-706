import { body, validationResult } from 'express-validator';

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};

// Registration validation
export const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('authMethod')
    .isIn(['email', 'phone'])
    .withMessage('Auth method must be either email or phone'),
  
  // Custom validation to ensure either email or phone is provided
  body().custom((value, { req }) => {
    if (req.body.authMethod === 'email' && !req.body.email) {
      throw new Error('Email is required when using email authentication');
    }
    if (req.body.authMethod === 'phone' && !req.body.phone) {
      throw new Error('Phone is required when using phone authentication');
    }
    return true;
  }),
  
  handleValidationErrors
];

// Login validation
export const validateLogin = [
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  
  body('password')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Password is required'),
  
  body('authMethod')
    .isIn(['email', 'phone'])
    .withMessage('Auth method must be either email or phone'),
  
  handleValidationErrors
];

// Phone verification validation
export const validatePhoneVerification = [
  body('phone')
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  
  body('code')
    .optional()
    .isLength({ min: 6, max: 6 })
    .withMessage('Verification code must be 6 digits'),
  
  handleValidationErrors
];
