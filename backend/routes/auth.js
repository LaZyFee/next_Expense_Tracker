const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/me', authMiddleware, authController.getMe);
router.put('/me', authMiddleware, authController.updateProfile);
router.put('/password', authMiddleware, authController.changePassword);

module.exports = router;
