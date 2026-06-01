const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense', 'saving'],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0.01,
        max: 99999999
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    note: {
        type: String,
        default: '',
        maxlength: 500
    },
    month: {
        type: Number,
        min: 1,
        max: 12
    },
    year: {
        type: Number,
        min: 2020,
        max: 2100
    }
}, {
    timestamps: true
});

// Auto-populate month and year before save
EntrySchema.pre('save', function (next) {
    this.month = this.date.getMonth() + 1;
    this.year = this.date.getFullYear();
    next();
});

// Indexes for efficient queries
EntrySchema.index({ userId: 1, date: -1 });
EntrySchema.index({ userId: 1, month: 1, year: 1 });
EntrySchema.index({ userId: 1, type: 1, date: -1 });
EntrySchema.index({ userId: 1, categoryId: 1, date: -1 });
module.exports = mongoose.model('Entry', EntrySchema);