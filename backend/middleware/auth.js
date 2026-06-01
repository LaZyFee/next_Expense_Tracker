const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id };
        next();
    } catch (ex) {
        if (ex?.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Session expired. Please log in again.',
                code: 'TOKEN_EXPIRED'
            });
        }
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token.',
            code: 'TOKEN_INVALID'
        });
    }
};
