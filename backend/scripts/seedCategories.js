const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');

dotenv.config();

const defaultCategories = [
    // Income Categories
    { name: 'Salary', icon: 'FaMoneyBillWave', type: 'income', color: '#4ECDC4', isSystem: true },
    { name: 'Freelance', icon: 'FaLaptopCode', type: 'income', color: '#45B7D1', isSystem: true },
    { name: 'Investment', icon: 'FaChartLine', type: 'income', color: '#96CEB4', isSystem: true },
    { name: 'Other Income', icon: 'FaPlusCircle', type: 'income', color: '#FFEAA7', isSystem: true },

    // Expense Categories
    { name: 'Food', icon: 'FaUtensils', type: 'expense', color: '#FF6B6B', isSystem: true },
    { name: 'Transport', icon: 'FaCar', type: 'expense', color: '#4ECDC4', isSystem: true },
    { name: 'Shopping', icon: 'FaShoppingBag', type: 'expense', color: '#FFE66D', isSystem: true },
    { name: 'Bills', icon: 'FaFileInvoiceDollar', type: 'expense', color: '#FF6B6B', isSystem: true },
    { name: 'Health', icon: 'FaHeartbeat', type: 'expense', color: '#A8E6CF', isSystem: true },
    { name: 'Entertainment', icon: 'FaFilm', type: 'expense', color: '#FFD93D', isSystem: true },
    { name: 'Other Expense', icon: 'FaPlusCircle', type: 'expense', color: '#C7CEEA', isSystem: true },

    // Saving Categories
    { name: 'Emergency Fund', icon: 'FaShieldAlt', type: 'saving', color: '#FF6B6B', isSystem: true },
    { name: 'Goal Saving', icon: 'FaBullseye', type: 'saving', color: '#4ECDC4', isSystem: true },
    { name: 'Investment Saving', icon: 'FaChartPie', type: 'saving', color: '#45B7D1', isSystem: true }
];

const seedCategories = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/expenseflow';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Delete existing system categories
        await Category.deleteMany({ isSystem: true });
        console.log('Cleared existing system categories');

        // Insert default categories
        for (const category of defaultCategories) {
            await Category.create({ ...category, userId: null });
            console.log(`✅ Created category: ${category.name}`);
        }

        console.log('🎉 System categories seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding categories:', err);
        process.exit(1);
    }
};

seedCategories();