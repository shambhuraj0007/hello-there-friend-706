import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Read and validate required secrets once
const {
  JWT_SECRET,
  REFRESH_TOKEN_SECRET,
  JWT_EXPIRE = '7d',
  REFRESH_TOKEN_EXPIRE = '30d',
} = process.env;

if (!JWT_SECRET || !REFRESH_TOKEN_SECRET) {
  console.error('[AUTH CONFIG ERROR] Missing JWT secrets. Please set JWT_SECRET and REFRESH_TOKEN_SECRET in Backend/.env');
}

// Generate JWT tokens
export const generateTokens = (userId) => {
  if (!JWT_SECRET || !REFRESH_TOKEN_SECRET) {
    throw new Error('Server misconfiguration: JWT secrets are not set');
  }

  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
  const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRE });
  return { accessToken, refreshToken };
};

// Verify JWT token middleware
export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    if (!user.isActive || user.isBanned) {
      return res.status(401).json({
        success: false,
        message: 'Account is disabled or banned.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.',
        code: 'TOKEN_EXPIRED'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Optional authentication (won't fail if no token)
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive && !user.isBanned) {
        req.user = user;
      }
    }
  } catch (error) {
    // Silently ignore auth errors for optional auth
  }
  next();
};

// Admin only middleware
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};
