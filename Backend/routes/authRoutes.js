import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  register,
  login,
  verifyPhone,
  verifyEmail,
  resendVerification,
  refreshToken,
  logout,
  getCurrentUser
} from '../controllers/authController.js';
import {
  validateRegistration,
  validateLogin,
  validatePhoneVerification
} from '../middlewares/validation.js';
import { authenticate, optionalAuth } from '../middlewares/auth.js';

const router = express.Router();

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  }
});

const verificationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // Limit each IP to 3 verification attempts per windowMs
  message: {
    success: false,
    message: 'Too many verification attempts, please try again later.'
  }
});

// Public routes
router.post('/register', authLimiter, validateRegistration, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/verify-phone', verificationLimiter, validatePhoneVerification, verifyPhone);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', verificationLimiter, resendVerification);
router.post('/refresh-token', refreshToken);

// Protected routes
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getCurrentUser);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Auth service is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
