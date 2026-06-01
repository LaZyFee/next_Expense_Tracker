const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);
router.get('/excel', exportController.exportToExcel);
router.get('/pdf', exportController.exportToPDF);

module.exports = router;