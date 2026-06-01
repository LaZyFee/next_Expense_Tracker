const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        // Only create transporter if email config exists
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            this.transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.EMAIL_PORT) || 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
            this.enabled = true;
        } else {
            console.warn('⚠️ Email service disabled - missing EMAIL_USER or EMAIL_PASS');
            this.enabled = false;
        }
    }

    async sendPasswordResetEmail(email, resetToken, userName) {
        if (!this.enabled) {
            console.log(`📧 [EMAIL DISABLED] Would send password reset to: ${email}`);
            console.log(`🔗 Reset link: ${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`);
            return true;
        }

        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_FROM || 'noreply@expenseflow.com',
            to: email,
            subject: 'ExpenseFlow - Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4ECDC4;">Password Reset Request</h2>
                    <p>Hello ${userName},</p>
                    <p>You requested to reset your password for your ExpenseFlow account. Click the button below to reset your password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" 
                           style="background-color: #4ECDC4; 
                                  color: white; 
                                  padding: 12px 24px; 
                                  text-decoration: none; 
                                  border-radius: 5px;
                                  display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="color: #666;">${resetUrl}</p>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <hr style="margin: 20px 0;">
                    <p style="color: #999; font-size: 12px;">ExpenseFlow - Your Personal Finance Tracker</p>
                </div>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Password reset email sent to ${email}`);
            return true;
        } catch (error) {
            console.error('❌ Email sending failed:', error);
            return false;
        }
    }
}

module.exports = new EmailService();