import { z } from 'zod'

export const signupSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
})

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
})

export const entrySchema = z.object({
    type: z.enum(['income', 'expense', 'saving']),
    amount: z.number().positive().max(99999999),
    categoryId: z.string().regex(/^[a-f\d]{24}$/i),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    note: z.string().max(500).optional(),
})

export const categorySchema = z.object({
    name: z.string().min(1).max(50),
    icon: z.string().min(1),
    type: z.enum(['income', 'expense', 'saving', 'all']),
    color: z.string().regex(/^#[0-9A-F]{6}$/i),
})

export const budgetSchema = z.object({
    categoryId: z.string().regex(/^[a-f\d]{24}$/i),
    amount: z.number().positive(),
    month: z.number().min(1).max(12),
    year: z.number().min(2020).max(2100),
})