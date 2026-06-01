const Entry = require('../models/Entry');

exports.getMonthlySummary = async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({
                success: false,
                message: 'Month and year are required'
            });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const entries = await Entry.find({
            userId: req.user.id,
            date: { $gte: startDate, $lte: endDate }
        });

        const totals = entries.reduce((acc, curr) => {
            acc[curr.type] += curr.amount;
            return acc;
        }, { income: 0, expense: 0, saving: 0 });

        // Calculate carryover from previous month
        let carriedOverSavings = 0;
        if (month > 1 || year > 2020) {
            const prevMonth = month === 1 ? 12 : month - 1;
            const prevYear = month === 1 ? year - 1 : year;

            const prevStart = new Date(prevYear, prevMonth - 1, 1);
            const prevEnd = new Date(prevYear, prevMonth, 0, 23, 59, 59);

            const prevEntries = await Entry.find({
                userId: req.user.id,
                date: { $gte: prevStart, $lte: prevEnd }
            });

            const prevTotals = prevEntries.reduce((acc, curr) => {
                acc[curr.type] += curr.amount;
                return acc;
            }, { income: 0, expense: 0, saving: 0 });

            const prevRemainingAfterExpense = prevTotals.income - prevTotals.saving - prevTotals.expense;
            carriedOverSavings = Math.max(0, prevRemainingAfterExpense);
        }

        const remainingAfterSaving = totals.income - totals.saving;
        const remainingAfterExpense = remainingAfterSaving - totals.expense;
        const effectiveSavings = totals.saving + Math.max(0, remainingAfterExpense);

        res.json({
            success: true,
            data: {
                month: parseInt(month),
                year: parseInt(year),
                totalIncome: totals.income,
                totalExpense: totals.expense,
                totalSaving: totals.saving,
                remainingAfterSaving,
                remainingAfterExpense,
                carriedOverSavings,
                effectiveSavings
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.getMonthlyTrend = async (req, res) => {
    try {
        let { year, months = 6 } = req.query;
        year = parseInt(year);
        months = parseInt(months);

        if (!year) {
            return res.status(400).json({
                success: false,
                message: 'Year is required'
            });
        }

        const trend = [];
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;

        // Determine last N months up to the specified year
        let endMonth = 12;
        let endYear = year;

        // If requesting current year, only show up to current month
        if (year === currentYear) {
            endMonth = currentMonth;
        }

        // Build month list going backwards
        let targetYear = endYear;
        let targetMonth = endMonth;

        for (let i = 0; i < months; i++) {
            const startDate = new Date(targetYear, targetMonth - 1, 1);
            const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

            const entries = await Entry.find({
                userId: req.user.id,
                date: { $gte: startDate, $lte: endDate }
            });

            const totals = entries.reduce((acc, curr) => {
                acc[curr.type] += curr.amount;
                return acc;
            }, { income: 0, expense: 0, saving: 0 });

            trend.unshift({  // unshift to maintain chronological order
                month: targetMonth,
                year: targetYear,
                income: totals.income,
                expense: totals.expense,
                saving: totals.saving
            });

            // Move to previous month
            targetMonth--;
            if (targetMonth < 1) {
                targetMonth = 12;
                targetYear--;
                if (targetYear < 2020) break; // prevent going too far back
            }
        }

        res.json({
            success: true,
            data: trend
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.getCategoryBreakdown = async (req, res) => {
    try {
        const { month, year, type = 'expense' } = req.query;

        if (!month || !year) {
            return res.status(400).json({
                success: false,
                message: 'Month and year are required'
            });
        }

        const breakdown = await Entry.aggregate([
            {
                $match: {
                    userId: req.user.id,
                    type: type,
                    month: parseInt(month),
                    year: parseInt(year)
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: '$category'
            },
            {
                $group: {
                    _id: '$categoryId',
                    categoryName: { $first: '$category.name' },
                    color: { $first: '$category.color' },
                    total: { $sum: '$amount' }
                }
            },
            {
                $group: {
                    _id: null,
                    categories: {
                        $push: {
                            category: '$_id',
                            name: '$categoryName',
                            color: '$color',
                            total: '$total'
                        }
                    },
                    grandTotal: { $sum: '$total' }
                }
            }
        ]);

        let result = [];
        if (breakdown.length > 0) {
            result = breakdown[0].categories.map(cat => ({
                category: cat.name,
                color: cat.color,
                total: cat.total,
                percentage: (cat.total / breakdown[0].grandTotal) * 100
            }));
        }

        res.json({
            success: true,
            data: result
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


