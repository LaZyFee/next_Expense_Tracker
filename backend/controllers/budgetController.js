const Budget = require('../models/Budget');
const Entry = require('../models/Entry');
const { budgetSchema } = require('../schemas/validation');

exports.getBudgets = async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({
                success: false,
                message: 'Month and year are required'
            });
        }

        const budgets = await Budget.find({
            userId: req.user.id,
            month: parseInt(month),
            year: parseInt(year)
        }).populate('categoryId', 'name icon color');

        // Calculate spent amounts for each category
        const budgetsWithSpent = await Promise.all(budgets.map(async (budget) => {
            const spent = await Entry.aggregate([
                {
                    $match: {
                        userId: req.user.id,
                        categoryId: budget.categoryId._id,
                        type: 'expense',
                        month: parseInt(month),
                        year: parseInt(year)
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$amount' }
                    }
                }
            ]);

            const spentAmount = spent[0]?.total || 0;
            const remaining = budget.amount - spentAmount;
            const percentage = (spentAmount / budget.amount) * 100;

            return {
                _id: budget._id,
                category: budget.categoryId,
                amount: budget.amount,
                spent: spentAmount,
                remaining: remaining,
                percentage: Math.min(percentage, 100),
                month: budget.month,
                year: budget.year
            };
        }));

        res.json({
            success: true,
            data: budgetsWithSpent
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.createBudget = async (req, res) => {
    try {
        const validatedData = budgetSchema.parse(req.body);

        // Check if budget already exists
        const existingBudget = await Budget.findOne({
            userId: req.user.id,
            categoryId: validatedData.categoryId,
            month: validatedData.month,
            year: validatedData.year
        });

        if (existingBudget) {
            return res.status(409).json({
                success: false,
                message: 'Budget already exists for this category and month'
            });
        }

        const budget = new Budget({
            ...validatedData,
            userId: req.user.id
        });
        await budget.save();

        const populatedBudget = await Budget.findById(budget._id)
            .populate('categoryId', 'name icon color');

        res.status(201).json({
            success: true,
            data: populatedBudget
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

exports.updateBudget = async (req, res) => {
    try {
        const validatedData = budgetSchema.parse(req.body);

        const budget = await Budget.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            validatedData,
            { new: true, runValidators: true }
        ).populate('categoryId', 'name icon color');

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: 'Budget not found'
            });
        }

        res.json({
            success: true,
            data: budget
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

exports.deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: 'Budget not found'
            });
        }

        res.json({
            success: true,
            message: 'Budget deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};