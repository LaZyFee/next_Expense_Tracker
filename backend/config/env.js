const dotenv = require('dotenv');
dotenv.config();

const requiredEnvVars = [
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET'
];

requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        console.warn(`⚠️ Warning: Missing environment variable: ${varName}`);
    }
});

module.exports = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret_change_me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
};