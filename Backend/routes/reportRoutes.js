import express from 'express';
import {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
  deleteReport,
  getReportsByLocation,
  getDashboardStats,
  getRecentReports
} from '../controllers/reportController.js';

const router = express.Router();

// Public routes
router.post('/reports', createReport);
router.get('/reports', getReports);
router.get('/reports/stats', getDashboardStats);
router.get('/reports/nearby', getReportsByLocation);
router.get('/reports/recent', getRecentReports);
router.get('/reports/:id', getReportById);

// Admin routes (you can add authentication middleware here)
router.put('/reports/:id/status', updateReportStatus);
router.delete('/reports/:id', deleteReport);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Civic Reports API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

export default router;
