import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import reportRoutes from './routes/reportRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Debug origin - helpful while diagnosing CORS issues
    if (process.env.NODE_ENV !== 'production') {
      console.log('CORS check for origin:', origin);
    }

    // Allow server-to-server, curl, Postman, or same-origin (no Origin header)
    // This also covers mobile apps which often don't send Origin headers
    if (!origin) return callback(null, true);

    // Build allowed origins from env (supports comma-separated list)
    const fromEnv = [
      process.env.FRONTEND_URL,
      ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map(s => s.trim()) : [])
    ].filter(Boolean);

    const defaults = [
      'http://localhost:8080',
      'http://localhost:5173',
      'http://127.0.0.1:8080',
      'http://127.0.0.1:5173',
      // Mobile app origins
      'http://localhost',          // Android Capacitor
      'capacitor://localhost',     // iOS Capacitor
      'ionic://localhost',         // Ionic apps
      'http://localhost:3000'     // React dev server
    ];

    const allowed = new Set([...fromEnv, ...defaults]);

    // In development, allow any localhost/127.0.0.1 with any port
    const isDev = (process.env.NODE_ENV || 'development') !== 'production';
    const localhostRegex = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;
    
    // Mobile app specific patterns
    const mobileRegex = /^(capacitor|ionic):\/\/localhost$/i;

    if (allowed.has(origin) || 
        (isDev && localhostRegex.test(origin)) ||
        mobileRegex.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', reportRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:8080'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`☁️  Cloudinary Cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log(`🔐 Auth endpoints available at /api/auth`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});
