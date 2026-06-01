const Entry = require('../models/Entry');
const { entrySchema, paginationSchema } = require('../schemas/validation');

exports.getEntries = async (req, res) => {
    try {
        const validatedQuery = paginationSchema.parse(req.query);
        const { page, limit, sortBy, sortOrder, month, year, type, categoryId } = validatedQuery;

        const query = { userId: req.user.id };

        if (month && year) {
            query.month = month;
            query.year = year;
        }
        if (type) query.type = type;
        if (categoryId) query.categoryId = categoryId;

        const skip = (page - 1) * limit;
        const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

        const entries = await Entry.find(query)
            .populate('categoryId', 'name icon color')
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        const total = await Entry.countDocuments(query);

        // Format response
        const formattedEntries = entries.map(entry => ({
            _id: entry._id,
            type: entry.type,
            amount: entry.amount,
            category: entry.categoryId,
            date: entry.date,
            note: entry.note,
            month: entry.month,
            year: entry.year,
            createdAt: entry.createdAt,
            updatedAt: entry.updatedAt
        }));

        res.json({
            success: true,
            data: formattedEntries,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
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

exports.getEntryById = async (req, res) => {
    try {
        const entry = await Entry.findOne({
            _id: req.params.id,
            userId: req.user.id
        }).populate('categoryId', 'name icon color');

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Entry not found'
            });
        }

        res.json({
            success: true,
            data: {
                _id: entry._id,
                type: entry.type,
                amount: entry.amount,
                category: entry.categoryId,
                date: entry.date,
                note: entry.note,
                month: entry.month,
                year: entry.year,
                createdAt: entry.createdAt,
                updatedAt: entry.updatedAt
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.createEntry = async (req, res) => {
    try {
        const validatedData = entrySchema.parse(req.body);

        const entry = new Entry({
            ...validatedData,
            userId: req.user.id,
            date: validatedData.date
        });
        await entry.save();

        const populatedEntry = await Entry.findById(entry._id)
            .populate('categoryId', 'name icon color');

        res.status(201).json({
            success: true,
            data: {
                _id: populatedEntry._id,
                type: populatedEntry.type,
                amount: populatedEntry.amount,
                category: populatedEntry.categoryId,
                date: populatedEntry.date,
                note: populatedEntry.note,
                month: populatedEntry.month,
                year: populatedEntry.year
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

exports.updateEntry = async (req, res) => {
    try {
        const updateData = { ...req.body };

        // Handle date conversion if present
        if (updateData.date) {
            updateData.date = new Date(updateData.date);
        }

        // Partial validation - only validate provided fields
        const validatedData = entrySchema.partial().parse(updateData);

        const entry = await Entry.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            validatedData,
            { new: true, runValidators: true }
        ).populate('categoryId', 'name icon color');

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Entry not found'
            });
        }

        res.json({
            success: true,
            data: {
                _id: entry._id,
                type: entry.type,
                amount: entry.amount,
                category: entry.categoryId,
                date: entry.date,
                note: entry.note,
                month: entry.month,
                year: entry.year
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

exports.deleteEntry = async (req, res) => {
    try {
        const entry = await Entry.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Entry not found'
            });
        }

        res.json({
            success: true,
            message: 'Entry deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};