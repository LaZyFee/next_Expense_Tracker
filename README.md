# 💰 ExpenseFlow — Full-Stack Expense Tracker

> AI-Friendly Documentation | Version 1.0

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture Overview](#architecture-overview)
4. [Project Structure](#project-structure)
5. [Database Schema](#database-schema)
6. [Backend API Documentation](#backend-api-documentation)
7. [Frontend Pages & Components](#frontend-pages--components)
8. [Business Logic Rules](#business-logic-rules)
9. [Authentication Flow](#authentication-flow)
10. [Environment Variables](#environment-variables)
11. [Setup Instructions](#setup-instructions)

---

## Project Overview

**ExpenseFlow** is a user-based personal finance tracker that records income, savings, and expenses. It supports:

- Monthly financial summaries with carry-over savings logic
- CRUD for entries and custom categories
- Chart-based statistics, table-based history with pagination
- Dark/light theme, responsive design, role-based data isolation

---

## Tech Stack

| Layer       | Technology                              |
| ----------- | --------------------------------------- |
| Frontend    | Next.js 14+ (App Router)                |
| Styling     | Tailwind CSS v3                         |
| Icons       | react-icons                             |
| Charts      | react-chartjs-2 + Chart.js              |
| Table       | @tanstack/react-table v8                |
| Toast       | SweetAlert2 (sweetalert2-react-content) |
| Date Picker | react-datepicker                        |
| Validation  | Zod (shared frontend + backend)         |
| Backend     | Express.js (Node.js)                    |
| Database    | MongoDB + Mongoose                      |
| Auth        | JWT (httpOnly cookies)                  |

---

## Architecture Overview

```
Client (Next.js App Router)
  ├── Server Components  → SSR data fetching via fetch() with server actions
  ├── Client Components  → Interactive UI (forms, charts, tables, modals)
  └── Server Actions     → Mutations (create/update/delete) via "use server"

Backend (Express.js REST API)
  ├── /api/auth          → login, signup, logout, me
  ├── /api/entries       → CRUD for income/expense/savings entries
  ├── /api/categories    → CRUD for user-customizable categories
  ├── /api/budgets       → monthly budget management
  └── /api/reports       → aggregated stats, monthly summaries

Database (MongoDB)
  ├── users
  ├── entries
  ├── categories
  └── budgets
```

---

## Project Structure

### Frontend (`/frontend`)

```
frontend/
├── app/
│   ├── layout.jsx                  # Root layout (ThemeProvider, fonts)
│   ├── page.jsx                    # Landing / redirect to dashboard
│   ├── (auth)/
│   │   ├── login/page.jsx          # Login page (SSR + client form)
│   │   └── signup/page.jsx         # Signup page
│   ├── (dashboard)/
│   │   ├── layout.jsx              # Dashboard shell (sidebar, header)
│   │   ├── dashboard/page.jsx      # Dashboard overview (SSR)
│   │   ├── entries/
│   │   │   ├── page.jsx            # Entries list (SSR + TanStack table)
│   │   │   └── add/page.jsx        # Add entry form
│   │   ├── categories/page.jsx     # Manage custom categories
│   │   ├── budgets/page.jsx        # Budget management
│   │   └── reports/page.jsx        # Reports & graphs
│   └── api/                        # Next.js route handlers (proxy or direct)
│
├── components/
│   ├── ui/
│   │   ├── ThemeSwitcher.jsx       # Dark/Light toggle
│   │   ├── Modal.jsx               # Reusable modal wrapper
│   │   ├── Pagination.jsx          # Table pagination controls
│   │   └── Spinner.jsx
│   ├── forms/
│   │   ├── EntryForm.jsx           # Add/Edit entry (client component)
│   │   ├── CategoryForm.jsx
│   │   └── BudgetForm.jsx
│   ├── tables/
│   │   ├── EntriesTable.jsx        # TanStack table with date sort & pagination
│   │   └── columns.js              # Column definitions
│   ├── charts/
│   │   ├── MonthlyBarChart.jsx     # Income vs Expense bar chart
│   │   ├── CategoryPieChart.jsx    # Expense by category
│   │   └── SavingsLineChart.jsx    # Savings trend over months
│   ├── dashboard/
│   │   ├── SummaryCards.jsx        # Income, Expense, Savings, Remaining cards
│   │   └── RecentEntries.jsx
│   └── layout/
│       ├── Sidebar.jsx
│       ├── Header.jsx
│       └── MobileNav.jsx
│
├── actions/
│   ├── entryActions.js             # Server actions for entries
│   ├── categoryActions.js
│   └── budgetActions.js
│
├── lib/
│   ├── api.js                      # Fetch wrapper for Express API
│   ├── auth.js                     # Token/session helpers
│   └── utils.js                    # Currency format, date helpers
│
├── schemas/
│   └── index.js                    # Shared Zod schemas (also used in backend)
│
└── tailwind.config.js
```

### Backend (`/backend`)

```
backend/
├── src/
│   ├── server.js                   # Express app entry
│   ├── config/
│   │   ├── db.js                   # Mongoose connection
│   │   └── env.js                  # dotenv + validation
│   ├── models/
│   │   ├── User.js
│   │   ├── Entry.js
│   │   ├── Category.js
│   │   └── Budget.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── entry.routes.js
│   │   ├── category.routes.js
│   │   ├── budget.routes.js
│   │   └── report.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── entry.controller.js
│   │   ├── category.controller.js
│   │   ├── budget.controller.js
│   │   └── report.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js      # JWT verify
│   │   ├── validate.middleware.js  # Zod validation middleware
│   │   └── errorHandler.js
│   └── schemas/
│       └── index.js                # Zod schemas (same as frontend/schemas)
│
└── package.json
```

---

## Database Schema

### `users` Collection

```
{
  _id: ObjectId,
  name: string,
  email: string,           // unique
  password: string,        // bcrypt hashed
  createdAt: Date,
  updatedAt: Date
}
```

### `entries` Collection

```
{
  _id: ObjectId,
  userId: ObjectId,        // ref: users
  type: "income" | "expense" | "saving",
  amount: number,          // positive float
  categoryId: ObjectId,    // ref: categories
  date: Date,              // entry date (used for date-wise sorting)
  note: string,            // optional text note
  month: number,           // 1-12 (derived from date)
  year: number,            // e.g. 2025 (derived from date)
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ userId: 1, date: -1 }` — for date-wise sorted queries
- `{ userId: 1, month: 1, year: 1 }` — for monthly summaries

### `categories` Collection

```
{
  _id: ObjectId,
  userId: ObjectId,        // null = system default, ObjectId = user custom
  name: string,
  icon: string,            // react-icons key or emoji
  type: "income" | "expense" | "saving" | "all",
  color: string,           // hex color for chart display
  createdAt: Date
}
```

**Default system categories (seeded):**
- Income: Salary, Freelance, Investment, Other Income
- Expense: Food, Transport, Shopping, Bills, Health, Entertainment, Other
- Saving: Emergency Fund, Goal Saving, Investment Saving

### `budgets` Collection

```
{
  _id: ObjectId,
  userId: ObjectId,
  categoryId: ObjectId,    // ref: categories
  amount: number,          // budget limit
  month: number,
  year: number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Backend API Documentation

### Base URL: `http://localhost:5000/api`

All protected routes require: `Authorization: Bearer <token>` header.

---

### Auth Routes `/api/auth`

#### `POST /api/auth/signup`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response `201`:**
```json
{
  "success": true,
  "token": "<jwt>",
  "user": { "_id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

---

#### `POST /api/auth/login`
Authenticate existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response `200`:**
```json
{
  "success": true,
  "token": "<jwt>",
  "user": { "_id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

---

#### `GET /api/auth/me` 🔒
Get authenticated user profile.

**Response `200`:**
```json
{
  "success": true,
  "user": { "_id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

---

### Entry Routes `/api/entries` 🔒

#### `GET /api/entries`
Get paginated entries for the authenticated user.

**Query Parameters:**
| Param      | Type   | Default | Description                      |
| ---------- | ------ | ------- | -------------------------------- |
| page       | number | 1       | Page number                      |
| limit      | number | 10      | Items per page                   |
| month      | number | —       | Filter by month (1–12)           |
| year       | number | —       | Filter by year                   |
| type       | string | —       | `income`, `expense`, or `saving` |
| categoryId | string | —       | Filter by category               |
| sortBy     | string | date    | Sort field                       |
| sortOrder  | string | desc    | `asc` or `desc`                  |

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "type": "expense",
      "amount": 1500,
      "category": { "_id": "...", "name": "Food", "icon": "...", "color": "#FF6B6B" },
      "date": "2025-06-15T00:00:00.000Z",
      "note": "Groceries at Shwapno",
      "month": 6,
      "year": 2025
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

#### `POST /api/entries`
Create a new entry.

**Request Body:**
```json
{
  "type": "expense",
  "amount": 1500,
  "categoryId": "<objectId>",
  "date": "2025-06-15",
  "note": "Groceries"
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": { "_id": "...", "type": "expense", "amount": 1500, ... }
}
```

---

#### `GET /api/entries/:id`
Get single entry by ID.

---

#### `PUT /api/entries/:id`
Update an entry. Same body as POST (all fields optional).

---

#### `DELETE /api/entries/:id`
Delete an entry.

**Response `200`:**
```json
{ "success": true, "message": "Entry deleted" }
```

---

### Category Routes `/api/categories` 🔒

#### `GET /api/categories`
Get all categories (system defaults + user's custom categories).

**Query:** `?type=expense` (optional filter)

**Response `200`:**
```json
{
  "success": true,
  "data": [
    { "_id": "...", "name": "Food", "icon": "FaUtensils", "type": "expense", "color": "#FF6B6B", "isSystem": true },
    { "_id": "...", "name": "My Custom", "icon": "FaStar", "type": "expense", "color": "#4ECDC4", "isSystem": false }
  ]
}
```

---

#### `POST /api/categories`
Create a custom category.

**Request Body:**
```json
{
  "name": "Side Business",
  "icon": "FaBriefcase",
  "type": "income",
  "color": "#45B7D1"
}
```

---

#### `PUT /api/categories/:id`
Update a user's custom category (cannot edit system categories).

---

#### `DELETE /api/categories/:id`
Delete a custom category (cannot delete system categories).

---

### Budget Routes `/api/budgets` 🔒

#### `GET /api/budgets`
Get budgets for a specific month/year.

**Query:** `?month=6&year=2025`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "category": { "name": "Food", "icon": "FaUtensils" },
      "amount": 5000,
      "spent": 3200,
      "remaining": 1800,
      "percentage": 64
    }
  ]
}
```

---

#### `POST /api/budgets`
Set a budget for a category in a month.

**Request Body:**
```json
{
  "categoryId": "<objectId>",
  "amount": 5000,
  "month": 6,
  "year": 2025
}
```

---

#### `PUT /api/budgets/:id`
Update a budget amount.

---

#### `DELETE /api/budgets/:id`
Delete a budget.

---

### Report Routes `/api/reports` 🔒

#### `GET /api/reports/monthly-summary`
Get income, expense, savings, and remaining for a specific month.

**Query:** `?month=6&year=2025`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "month": 6,
    "year": 2025,
    "totalIncome": 20000,
    "totalExpense": 12000,
    "totalSaving": 6000,
    "remainingAfterSaving": 14000,
    "remainingAfterExpense": 2000,
    "carriedOverSavings": 0,
    "effectiveSavings": 8000
  }
}
```

> **Note on carry-over logic:** `effectiveSavings = totalSaving + remainingAfterExpense`. This value is stored/referenced for the next month.

---

#### `GET /api/reports/monthly-trend`
Get month-over-month data for charts.

**Query:** `?year=2025&months=6` (last N months)

**Response `200`:**
```json
{
  "success": true,
  "data": [
    { "month": 1, "year": 2025, "income": 18000, "expense": 10000, "saving": 5000 },
    { "month": 2, "year": 2025, "income": 20000, "expense": 12000, "saving": 6000 }
  ]
}
```

---

#### `GET /api/reports/category-breakdown`
Expense totals by category for a given month.

**Query:** `?month=6&year=2025&type=expense`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    { "category": "Food", "color": "#FF6B6B", "total": 4000, "percentage": 33 },
    { "category": "Transport", "color": "#4ECDC4", "total": 2000, "percentage": 17 }
  ]
}
```

---

## Frontend Pages & Components

### Pages

#### `/login` — Login Page
- **Type:** Server Page + Client Form Component
- **SSR:** Redirect to `/dashboard` if token cookie exists
- Fields: Email, Password
- On submit: POST `/api/auth/login` → store JWT in cookie → redirect to `/dashboard`
- Show SweetAlert2 toast on error

---

#### `/signup` — Signup Page
- **Type:** Server Page + Client Form Component
- Fields: Name, Email, Password, Confirm Password
- Zod validation on client before submit
- On success: redirect to `/dashboard`

---

#### `/dashboard` — Dashboard Overview
- **Type:** Server Component (SSR) + Client sub-components
- **SSR fetches:** `monthly-summary` for current month
- **Renders:**
  - `SummaryCards` (Income, Expense, Savings, Remaining — 4 cards)
  - `MonthlyBarChart` (last 6 months trend)
  - `CategoryPieChart` (current month expense breakdown)
  - `RecentEntries` (last 5 entries table)
- Month selector (client component, triggers re-fetch via query param)

---

#### `/entries` — Entries List
- **Type:** Server Component + Client Table
- **SSR fetches:** entries (page 1, current month, sorted by date desc)
- **Renders:** `EntriesTable` (TanStack Table)
  - Columns: Date, Type, Category, Amount, Note, Actions
  - Date-wise sorting (click column header)
  - Month filter dropdown
  - Type filter (income/expense/saving)
  - Pagination (client-side controlled, fetch new page from server)
  - Row click → `ViewDetailsModal`
  - Edit / Delete buttons per row

---

#### `/entries/add` — Add Entry
- **Type:** Server Page + Client Form
- Fields: Type (select), Amount, Category (dropdown, filtered by type), Date (date picker), Note (textarea)
- Category dropdown shows user custom + system categories
- On submit: Server Action → POST `/api/entries` → redirect to `/entries` with success toast

---

#### `/categories` — Category Manager
- **Type:** Server Page + Client CRUD UI
- Lists all user categories with edit/delete
- "Add Category" button → modal with form (name, icon picker, type, color picker)
- System categories shown as read-only (no edit/delete)

---

#### `/budgets` — Budget Manager
- **Type:** Server Page + Client UI
- Month/Year selector
- List budgets with progress bars (spent vs limit)
- "Set Budget" button → modal form
- Color-coded: green (<60%), yellow (60–85%), red (>85%)

---

#### `/reports` — Reports & Analytics
- **Type:** Server Page + Client Charts
- Tabs: Overview | By Category | Savings Trend
- **Overview tab:** Bar chart (monthly income vs expense vs saving)
- **Category tab:** Pie/doughnut chart + table breakdown
- **Savings tab:** Line chart showing savings growth with carry-over

---

### Key Components

#### `EntriesTable.js` (Client Component)

```
Props:
  initialData: Entry[]
  initialPagination: PaginationMeta
  initialFilters: FilterState

State:
  data, pagination, filters, sorting, isLoading

TanStack Table config:
  - manualPagination: true
  - manualSorting: true
  - columns: [select, date, type, category, amount, note, actions]
  - onSortingChange → re-fetch with new sortBy/sortOrder
  - onPaginationChange → re-fetch page

Features:
  - Date column: sortable asc/desc
  - Amount: formatted with currency (BDT ৳)
  - Type badge: color-coded pill
  - Actions: Edit (opens modal), Delete (SweetAlert2 confirm)
  - Row click → ViewDetailsModal
```

---

#### `EntryForm.js` (Client Component)

```
Props:
  entry?: Entry          // if provided, form is in edit mode
  onSuccess: () => void

Fields:
  - type: select (income | expense | saving)
  - amount: number input
  - categoryId: select (filtered by type, includes user categories)
  - date: react-datepicker (single date)
  - note: textarea (max 500 chars)

Validation: Zod schema (shared with backend)
Submit: calls server action or direct fetch to API
```

---

#### `SummaryCards.js` (Client Component)

```
Props:
  summary: MonthlySummary

Renders 4 cards:
  1. Total Income  (green)
  2. Total Expense (red)
  3. Set Savings   (blue)
  4. Effective Savings (purple) — includes carry-over from previous month

Formula displayed:
  Effective Savings = Set Savings + (Income - Savings - Expense)
  if (Income - Savings - Expense) > 0 → surplus added to savings
```

---

#### `ViewDetailsModal.js` (Client Component)

```
Props:
  entry: Entry | null
  onClose: () => void

Displays:
  - Type badge, Category with icon
  - Amount (large, colored)
  - Date (formatted)
  - Note (if exists)
  - Created/Updated timestamps
  - Edit button (opens EntryForm in modal)
  - Delete button (SweetAlert2 confirm)
```

---

#### `ThemeSwitcher.js` (Client Component)

```
Uses: next-themes or custom ThemeContext
Stores preference in localStorage
Toggles 'dark' class on <html>
Icon: FaSun (light) / FaMoon (dark) from react-icons
```

---

## Business Logic Rules

### Monthly Financial Calculation

```
Given a month:
  totalIncome    = sum of all "income" entries for that month
  totalSaving    = sum of all "saving" entries for that month (user-set aside)
  totalExpense   = sum of all "expense" entries for that month

  remainingAfterSaving = totalIncome - totalSaving
  remainingAfterExpense = remainingAfterSaving - totalExpense

  if remainingAfterExpense > 0:
    effectiveSavings = totalSaving + remainingAfterExpense   ← carry to next month
  else:
    effectiveSavings = totalSaving + remainingAfterExpense   ← may be less than set saving

  nextMonthCarryOver = max(0, remainingAfterExpense)
```

**Example:**
```
Month: June 2025
  Income:   ৳20,000
  Saving:   ৳6,000  (set aside at start of month)
  Expense:  ৳12,000 (accumulated through month)

  Remaining after saving:  20,000 - 6,000  = 14,000
  Remaining after expense: 14,000 - 12,000 = 2,000  ← surplus
  Effective Savings:       6,000  + 2,000  = 8,000  ← shown in July carry-over
```

---

### Category CRUD Rules

- System categories: visible to all users, cannot be edited/deleted
- Custom categories: per-user, full CRUD
- On category delete: entries using that category retain a `deletedCategory` fallback label
- Category dropdown in forms shows: system + user's custom, filtered by entry type

---

### Data Isolation

- Every DB query on entries, categories (custom), budgets **must** include `userId` filter
- JWT middleware extracts `userId` and attaches to `req.user`
- Never expose another user's data

---

## Authentication Flow

```
1. User submits login form (client)
2. Server Action / fetch → POST /api/auth/login
3. Backend: validate credentials, sign JWT (7d expiry)
4. Frontend: store token in httpOnly cookie (via Set-Cookie header)
   OR store in memory + refresh token in httpOnly cookie
5. All subsequent API calls send cookie automatically (same-origin)
   OR attach Authorization: Bearer <token> header
6. Next.js middleware.ts: check cookie on protected routes → redirect if missing
7. Server Components: read cookie via cookies() from next/headers → pass to fetch
```

---

## Zod Schemas (Shared)

File: `schemas/index.ts` (copy to both frontend and backend)

```
import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const entrySchema = z.object({
  type: z.enum(["income", "expense", "saving"]),
  amount: z.number().positive().max(99999999),
  categoryId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid category ID"),
  date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  note: z.string().max(500).optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1).max(50),
  icon: z.string().min(1),
  type: z.enum(["income", "expense", "saving", "all"]),
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
});

export const budgetSchema = z.object({
  categoryId: z.string().regex(/^[a-f\d]{24}$/i),
  amount: z.number().positive(),
  month: z.number().min(1).max(12),
  year: z.number().min(2020).max(2100),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type EntryInput = z.infer<typeof entrySchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type BudgetInput = z.infer<typeof budgetSchema>;
```

---

## Environment Variables

### Backend `.env`

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expenseflow
JWT_SECRET=your_jwt_secret_here_min_32_chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
JWT_SECRET=your_jwt_secret_here_min_32_chars
```

---

## Setup Instructions

### 1. Clone & Install

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### 2. Seed System Categories

```bash
cd backend && npm run seed
```

### 3. Run Development

```bash
# Backend (port 5000)
cd backend && npm run dev

# Frontend (port 3000)
cd frontend && npm run dev
```

---

## API Error Format

All errors follow this structure:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": [
    { "field": "email", "message": "Invalid email address" }
  ]
}
```

HTTP Status codes:
- `400` — Validation error
- `401` — Unauthorized (missing/invalid token)
- `403` — Forbidden (trying to access another user's data)
- `404` — Resource not found
- `409` — Conflict (e.g. duplicate email)
- `500` — Internal server error

---

##  Types Reference

```
// types/index.ts

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  icon: string;
  type: "income" | "expense" | "saving" | "all";
  color: string;
  isSystem: boolean;
}

export interface Entry {
  _id: string;
  type: "income" | "expense" | "saving";
  amount: number;
  category: Category;
  date: string;
  note?: string;
  month: number;
  year: number;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  _id: string;
  category: Category;
  amount: number;
  spent: number;
  remaining: number;
  percentage: number;
  month: number;
  year: number;
}

export interface MonthlySummary {
  month: number;
  year: number;
  totalIncome: number;
  totalExpense: number;
  totalSaving: number;
  remainingAfterSaving: number;
  remainingAfterExpense: number;
  carriedOverSavings: number;
  effectiveSavings: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: PaginationMeta;
  message?: string;
}
```

---

*Documentation generated for AI-assisted development. Every section maps 1:1 to implementation tasks.*

expense-tracker/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   └── transactionController.js
│   ├── models/
│   │   ├── Category.js
│   │   ├── Transaction.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── categories.js
│   │   └── transactions.js
│   ├── schemas/
│   │   └── validation.js
│   ├── middleware/
│   │   └── auth.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── app/
    │   ├── layout.jsx
    │   ├── page.jsx
    │   ├── login/
    │   │   └── page.jsx
    │   ├── signup/
    │   │   └── page.jsx
    │   ├── dashboard/
    │   │   └── page.jsx
    │   ├── entries/
    │   │   └── page.jsx
    │   └── categories/
    │       └── page.jsx
    ├── components/
    │   ├── ThemeProvider.jsx
    │   ├── ThemeToggle.jsx
    │   ├── Navbar.jsx
    │   ├── StatCard.jsx
    │   ├── DashboardCharts.jsx
    │   └── TransactionTable.jsx
    ├── lib/
    │   └── actions.js
    ├── tailwind.config.js
    ├── .env.local
    └── package.json



