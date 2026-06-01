const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    icon: {
        type: String,
        default: 'FaWallet'
    },
    type: {
        type: String,
        enum: ['income', 'expense', 'saving', 'all'],
        required: true
    },
    color: {
        type: String,
        default: '#4ECDC4',
        match: /^#[0-9A-F]{6}$/i
    },
    isSystem: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for efficient queries
CategorySchema.index({ userId: 1, type: 1 });

module.exports = mongoose.model('Category', CategorySchema);