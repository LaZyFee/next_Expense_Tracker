const { z } = require('zod');

// Auth Schemas
const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
});

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
});

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address')
});

const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
});

// Entry Schema
const entrySchema = z.object({
    type: z.enum(['income', 'expense', 'saving']),
    amount: z.number().positive('Amount must be greater than 0').max(99999999),
    categoryId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid category ID'),
    date: z.coerce.date(),
    note: z.string().max(500).optional()
});

// Category Schema
const categorySchema = z.object({
    name: z.string().min(1, 'Category name is required').max(50),
    // icon: z.string().min(1, 'Icon is required'),
    type: z.enum(['income', 'expense', 'saving', 'all']),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format')
});

// Budget Schema
const budgetSchema = z.object({
    categoryId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid category ID'),
    amount: z.number().positive('Budget amount must be greater than 0'),
    month: z.number().min(1).max(12),
    year: z.number().min(2020).max(2100)
});

// Query Validation
const paginationSchema = z.object({
    page: z.string().transform(Number).default('1'),
    limit: z.string().transform(Number).default('10'),
    sortBy: z.string().default('date'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    month: z.string().transform(Number).optional(),
    year: z.string().transform(Number).optional(),
    type: z.enum(['income', 'expense', 'saving']).optional(),
    categoryId: z.string().regex(/^[a-f\d]{24}$/i).optional()
});

module.exports = {
    signupSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    entrySchema,
    categorySchema,
    budgetSchema,
    paginationSchema
};