const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);
router.get('/monthly-summary', reportController.getMonthlySummary);
router.get('/monthly-trend', reportController.getMonthlyTrend);
router.get('/category-breakdown', reportController.getCategoryBreakdown);

module.exports = router;