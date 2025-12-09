const express = require('express');
const router = express.Router();
const { AnalyticsController } = require('../controllers/analyticsController');
const { auth, isInstitution } = require('../middleware/auth');

// Analytics routes for institutions
router.get('/mentorship-summary', auth, isInstitution, AnalyticsController.getMentorshipSummary);
router.get('/location-heatmap', auth, isInstitution, AnalyticsController.getLocationHeatmap);
router.get('/alumni-spotlight', auth, isInstitution, AnalyticsController.getAlumniSpotlight);
router.get('/overall', auth, isInstitution, AnalyticsController.getOverallAnalytics);
router.get('/activity', auth, isInstitution, AnalyticsController.getActivityAnalytics);

module.exports = router;