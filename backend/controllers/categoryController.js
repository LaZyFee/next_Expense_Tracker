const Category = require('../models/Category');
const Entry = require('../models/Entry');
const { categorySchema } = require('../schemas/validation');

exports.getCategories = async (req, res) => {
    try {
        const { type } = req.query;
        const query = {
            $or: [
                { userId: req.user.id },
                { userId: null, isSystem: true }
            ]
        };

        if (type && type !== 'all') {
            query.type = { $in: [type, 'all'] };
        }

        const categories = await Category.find(query).sort({ isSystem: -1, name: 1 });

        res.json({
            success: true,
            data: categories.map(cat => ({
                _id: cat._id,
                name: cat.name,
                icon: cat.icon,
                type: cat.type,
                color: cat.color,
                isSystem: cat.isSystem || cat.userId === null
            }))
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const validatedData = categorySchema.parse(req.body);

        const category = new Category({
            ...validatedData,
            userId: req.user.id,
            isSystem: false
        });
        await category.save();

        res.status(201).json({
            success: true,
            data: {
                _id: category._id,
                name: category.name,
                icon: category.icon,
                type: category.type,
                color: category.color,
                isSystem: false
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

exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findOne({
            _id: req.params.id,
            userId: req.user.id,
            isSystem: false
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found or cannot be edited'
            });
        }

        const validatedData = categorySchema.parse(req.body);
        Object.assign(category, validatedData);
        await category.save();

        res.json({
            success: true,
            data: {
                _id: category._id,
                name: category.name,
                icon: category.icon,
                type: category.type,
                color: category.color,
                isSystem: false
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

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findOne({
            _id: req.params.id,
            userId: req.user.id,
            isSystem: false
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found or cannot be deleted'
            });
        }

        // Check if category has entries
        const entryCount = await Entry.countDocuments({ categoryId: category._id });
        if (entryCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category with ${entryCount} existing entries. Please reassign or delete entries first.`
            });
        }

        await category.deleteOne();

        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};