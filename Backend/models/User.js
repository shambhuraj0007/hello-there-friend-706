import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },

  email: {
    type: String,
    required: function() {
      return !this.phone || this.authMethod === 'email';
    },
    unique: true,
    sparse: true, // Allows multiple null values
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },

  phone: {
    type: String,
    required: function() {
      return !this.email || this.authMethod === 'phone';
    },
    unique: true,
    sparse: true, // Allows multiple null values
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },

  password: {
    type: String,
    required: function() {
      return this.authMethod !== 'phone' || this.isVerified;
    },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password in queries by default
  },

  // Authentication
  authMethod: {
    type: String,
    enum: ['email', 'phone'],
    required: true
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  emailVerificationToken: String,
  emailVerificationExpires: Date,

  phoneVerificationCode: String,
  phoneVerificationExpires: Date,

  passwordResetToken: String,
  passwordResetExpires: Date,

  // Refresh Tokens
  refreshTokens: [{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Profile Information
  avatar: {
    url: String,
    publicId: String
  },

  location: {
    city: String,
    state: String,
    country: {
      type: String,
      default: 'India'
    }
  },

  // User Stats
  reportsCount: {
    type: Number,
    default: 0
  },

  resolvedReportsCount: {
    type: Number,
    default: 0
  },

  reputation: {
    type: Number,
    default: 0
  },

  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },

  isBanned: {
    type: Boolean,
    default: false
  },

  banReason: String,

  lastLogin: Date,

  // Notifications Preferences
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    },
    push: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ isVerified: 1 });
userSchema.index({ authMethod: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate verification code
userSchema.methods.generateVerificationCode = function() {
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  this.phoneVerificationCode = code;
  this.phoneVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return code;
};

// Instance method to verify phone code
userSchema.methods.verifyPhoneCode = function(code) {
  return this.phoneVerificationCode === code && 
         this.phoneVerificationExpires > Date.now();
};

// Virtual for display name
userSchema.virtual('displayName').get(function() {
  return this.name || this.email || this.phone;
});

// Transform output
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.refreshTokens;
    delete ret.emailVerificationToken;
    delete ret.phoneVerificationCode;
    delete ret.passwordResetToken;
    return ret;
  }
});

const User = mongoose.model('User', userSchema);

export default User;
