const validate = (schema) => (req, res, next) => {
    try {
        const validatedData = schema.parse(req.body);
        req.body = validatedData;
        next();
    } catch (err) {
        const errors = err.errors?.map(e => ({
            field: e.path.join('.'),
            message: e.message
        })) || [{ message: err.message }];

        res.status(400).json({
            success: false,
            message: 'Validation error',
            errors
        });
    }
};

const validateQuery = (schema) => (req, res, next) => {
    try {
        const validatedData = schema.parse(req.query);
        req.query = validatedData;
        next();
    } catch (err) {
        const errors = err.errors?.map(e => ({
            field: e.path.join('.'),
            message: e.message
        })) || [{ message: err.message }];

        res.status(400).json({
            success: false,
            message: 'Invalid query parameters',
            errors
        });
    }
};

module.exports = { validate, validateQuery };