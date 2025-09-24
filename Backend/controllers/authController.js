import User from '../models/User.js';
import { generateTokens } from '../middlewares/auth.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService.js';
import { sendVerificationSMS, sendPasswordResetSMS } from '../services/smsService.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// Register user
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, authMethod } = req.body;

    console.log('📝 Registration attempt:', { name, email, phone, authMethod });

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : [])
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `User with this ${authMethod} already exists`,
      });
    }

    // Create user
    const userData = {
      name,
      authMethod,
      ...(authMethod === 'email' && { email }),
      ...(authMethod === 'phone' && { phone }),
      ...(authMethod === 'email' && { password }),
    };

    const user = new User(userData);

    // Handle verification defaults
    const autoVerify = String(process.env.AUTO_VERIFY || '').toLowerCase() === 'true';
    if (!autoVerify) {
      // Handle email/phone verification normally
      if (authMethod === 'email') {
        user.emailVerificationToken = crypto.randomBytes(32).toString('hex');
        user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      }
      await user.save();

      if (authMethod === 'email') {
        await sendVerificationEmail(email, user.emailVerificationToken, name);
      } else if (authMethod === 'phone') {
        const verificationCode = user.generateVerificationCode();
        await user.save();
        await sendVerificationSMS(phone, verificationCode);
      }
    } else {
      // Auto-verify for development/testing
      user.isVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      user.phoneVerificationCode = undefined;
      user.phoneVerificationExpires = undefined;
      await user.save();
    }

    console.log('✅ User registered successfully:', user._id);

    res.status(201).json({
      success: true,
      message: autoVerify
        ? 'Registration successful (auto-verified). You can log in now.'
        : authMethod === 'email' 
          ? 'Registration successful! Please check your email for verification.'
          : 'Registration successful! Please check your phone for verification code.',
      data: {
        userId: user._id,
        authMethod,
        isVerified: user.isVerified,
        ...(authMethod === 'email' && { email }),
        ...(authMethod === 'phone' && { phone, needsVerification: true })
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, phone, password, authMethod } = req.body;

    console.log('🔐 Login attempt:', { email, phone, authMethod });

    // Find user
    const query = authMethod === 'email' ? { email } : { phone };
    const user = await User.findOne(query).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if account is active
    if (!user.isActive || user.isBanned) {
      return res.status(401).json({
        success: false,
        message: 'Account is disabled or banned',
      });
    }

    // For phone auth, check if verified
    if (authMethod === 'phone' && !user.isVerified) {
      const verificationCode = user.generateVerificationCode();
      await user.save();
      await sendVerificationSMS(phone, verificationCode);

      return res.status(200).json({
        success: false,
        message: 'Phone number not verified. Verification code sent.',
        needsVerification: true,
        userId: user._id
      });
    }

    // Check password for email auth
    if (authMethod === 'email') {
      if (!user.isVerified) {
        return res.status(401).json({
          success: false,
          message: 'Please verify your email first',
          needsEmailVerification: true
        });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Save refresh token
    user.refreshTokens.push({ token: refreshToken });
    user.lastLogin = new Date();
    await user.save();

    console.log('✅ Login successful:', user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          authMethod: user.authMethod,
          isVerified: user.isVerified,
          avatar: user.avatar,
          reportsCount: user.reportsCount,
          reputation: user.reputation
        },
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Verify phone number
export const verifyPhone = async (req, res) => {
  try {
    const { phone, code, password } = req.body;

    console.log('📞 Phone verification attempt:', { phone, code });

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.verifyPhoneCode(code)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code',
      });
    }

    // Set user as verified
    user.isVerified = true;
    user.phoneVerificationCode = undefined;
    user.phoneVerificationExpires = undefined;

    // Set password if provided (for phone registration)
    if (password && !user.password) {
      user.password = password;
    }

    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Save refresh token
    user.refreshTokens.push({ token: refreshToken });
    user.lastLogin = new Date();
    await user.save();

    console.log('✅ Phone verified successfully:', user._id);

    res.json({
      success: true,
      message: 'Phone verified successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          authMethod: user.authMethod,
          isVerified: user.isVerified,
          avatar: user.avatar,
          reportsCount: user.reportsCount,
          reputation: user.reputation
        },
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('❌ Phone verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Phone verification failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Resend verification
export const resendVerification = async (req, res) => {
  try {
    const { email, phone, authMethod } = req.body;

    const query = authMethod === 'email' ? { email } : { phone };
    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'User is already verified',
      });
    }

    if (authMethod === 'email') {
      user.emailVerificationToken = crypto.randomBytes(32).toString('hex');
      user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
      await user.save();
      
      await sendVerificationEmail(email, user.emailVerificationToken, user.name);
    } else {
      const verificationCode = user.generateVerificationCode();
      await user.save();
      
      await sendVerificationSMS(phone, verificationCode);
    }

    res.json({
      success: true,
      message: `Verification ${authMethod === 'email' ? 'email' : 'code'} sent successfully`,
    });

  } catch (error) {
    console.error('❌ Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Verify email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    console.log('✅ Email verified successfully:', user._id);

    res.json({
      success: true,
      message: 'Email verified successfully',
    });

  } catch (error) {
    console.error('❌ Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Email verification failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required',
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.refreshTokens.some(t => t.token === refreshToken)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    // Generate new tokens
    const tokens = generateTokens(user._id);

    // Remove old refresh token and add new one
    user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
    user.refreshTokens.push({ token: tokens.refreshToken });
    await user.save();

    res.json({
      success: true,
      data: tokens
    });

  } catch (error) {
    console.error('❌ Token refresh error:', error);
    res.status(401).json({
      success: false,
      message: 'Token refresh failed',
    });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken && req.user) {
      // Remove the refresh token
      req.user.refreshTokens = req.user.refreshTokens.filter(
        t => t.token !== refreshToken
      );
      await req.user.save();
    }

    res.json({
      success: true,
      message: 'Logged out successfully',
    });

  } catch (error) {
    console.error('❌ Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
    });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          authMethod: user.authMethod,
          isVerified: user.isVerified,
          avatar: user.avatar,
          location: user.location,
          reportsCount: user.reportsCount,
          resolvedReportsCount: user.resolvedReportsCount,
          reputation: user.reputation,
          notifications: user.notifications,
          createdAt: user.createdAt
        }
      }
    });

  } catch (error) {
    console.error('❌ Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user data',
    });
  }
};
