const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('../schemas/validation');
const emailService = require('../services/emailService');

exports.signup = async (req, res) => {
    try {
        const validatedData = signupSchema.parse(req.body);

        let user = await User.findOne({ email: validatedData.email });
        if (user) {
            return res.status(409).json({
                success: false,
                message: 'User already registered with this email'
            });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(validatedData.password, salt);

        user = new User({
            ...validatedData,
            password: hashedPassword
        });
        await user.save();

const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

        res.status(201).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        if (err.errors) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: err.errors
            });
        }
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const validatedData = loginSchema.parse(req.body);

        const user = await User.findOne({ email: validatedData.email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const validPassword = await bcrypt.compare(validatedData.password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

        res.json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        if (err.errors) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: err.errors
            });
        }
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.json({
            success: true,
            user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const validatedData = forgotPasswordSchema.parse(req.body);

        const user = await User.findOne({ email: validatedData.email });
        if (!user) {
            // Don't reveal that user doesn't exist for security
            return res.json({
                success: true,
                message: 'If your email is registered, you will receive a password reset link'
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        // Send email
        const emailSent = await emailService.sendPasswordResetEmail(user.email, resetToken, user.name);

        if (!emailSent && process.env.EMAIL_USER) {
            return res.status(500).json({
                success: false,
                message: 'Error sending password reset email. Please try again later.'
            });
        }

        res.json({
            success: true,
            message: 'Password reset link sent to your email'
        });
    } catch (err) {
        if (err.errors) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: err.errors
            });
        }
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const validatedData = resetPasswordSchema.parse(req.body);

        const hashedToken = crypto.createHash('sha256').update(validatedData.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Password reset token is invalid or has expired'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(validatedData.password, salt);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({
            success: true,
            message: 'Password has been reset successfully'
        });
    } catch (err) {
        if (err.errors) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: err.errors
            });
        }
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name } = req.body;

        if (typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Name is required'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name: name.trim() },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 8 characters'
            });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
