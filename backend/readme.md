# 📘 ExpenseFlow Frontend Integration Guide

> **For Frontend Developers** — Complete API contract, data models, and integration instructions.  
> **Backend Version:** 1.0 | **Last Updated:** 2026-06-01

---

## Table of Contents

1. [Base URL & Environment](#base-url--environment)
2. [Authentication](#authentication)
3. [API Endpoints Reference](#api-endpoints-reference)
   - [Auth](#auth-endpoints)
   - [Entries](#entry-routes-protected)
   - [Categories](#category-routes-protected)
   - [Budgets](#budget-routes-protected)
   - [Reports](#report-routes-protected)
   - [Export](#export-routes-protected)
4. [Data Models (TypeScript)](#data-models-typescript)
5. [Error Handling](#error-handling)
6. [Example Integration Snippets](#example-integration-snippets)
7. [Important Business Rules](#important-business-rules)

---

## Base URL & Environment

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

- All endpoints (except `/health`) return JSON.
- Protected endpoints require a `Bearer` token in the `Authorization` header.

---

## Authentication

### Token Storage & Usage

After login/signup, the backend returns a JWT. Store it securely (e.g., `httpOnly` cookie or `localStorage` with caution). Include it in every request:

```js
fetch(`${API_URL}/entries`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

---

## Auth Endpoints

### `POST /api/auth/signup` — Register a new user

**Request**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response `201`**
```json
{
  "success": true,
  "token": "<jwt>",
  "user": {
    "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### `POST /api/auth/login` — Login

**Request**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response `200`**
```json
{
  "success": true,
  "token": "<jwt>",
  "user": { "_id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

---

### `GET /api/auth/me` — Get current user *(protected)*

**Response `200`**
```json
{
  "success": true,
  "user": { "_id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

---

### `POST /api/auth/forgot-password` — Request password reset

**Request**
```json
{ "email": "john@example.com" }
```

**Response `200`**
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

---

### `POST /api/auth/reset-password` — Reset password

**Request**
```json
{
  "token": "reset_token_from_email",
  "password": "NewSecurePass123"
}
```

**Response `200`**
```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

---

## API Endpoints Reference

### Entry Routes *(Protected)*

**Base:** `/api/entries`

---

#### `GET /api/entries` — List entries (paginated, filterable)

| Query Param  | Type   | Default | Description                           |
| ------------ | ------ | ------- | ------------------------------------- |
| `page`       | number | `1`     | Page number                           |
| `limit`      | number | `10`    | Items per page                        |
| `month`      | number | —       | Filter by month (1–12)                |
| `year`       | number | —       | Filter by year                        |
| `type`       | string | —       | `income`, `expense`, or `saving`      |
| `categoryId` | string | —       | Filter by category ID                 |
| `sortBy`     | string | `date`  | Sort field (`date`, `amount`, `type`) |
| `sortOrder`  | string | `desc`  | `asc` or `desc`                       |

**Response `200`**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7a8b9c0d2",
      "type": "expense",
      "amount": 1500,
      "category": {
        "_id": "...",
        "name": "Food",
        "icon": "FaUtensils",
        "color": "#FF6B6B"
      },
      "date": "2025-06-15T00:00:00.000Z",
      "note": "Groceries",
      "month": 6,
      "year": 2025,
      "createdAt": "2025-06-15T10:30:00.000Z",
      "updatedAt": "2025-06-15T10:30:00.000Z"
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

#### `POST /api/entries` — Create a new entry

**Request**
```json
{
  "type": "expense",
  "amount": 1500,
  "categoryId": "65f1a2b3c4d5e6f7a8b9c0d3",
  "date": "2025-06-15",
  "note": "Groceries"
}
```

**Response `201`** — Same as single entry object inside `data`.

---

#### `GET /api/entries/:id` — Get one entry

**Response `200`**
```json
{
  "success": true,
  "data": { /* entry object */ }
}
```

---

#### `PUT /api/entries/:id` — Update an entry

**Request** — Same fields as `POST`, all optional.  
**Response `200`** — Updated entry.

---

#### `DELETE /api/entries/:id` — Delete an entry

**Response `200`**
```json
{
  "success": true,
  "message": "Entry deleted successfully"
}
```

---

### Category Routes *(Protected)*

**Base:** `/api/categories`

---

#### `GET /api/categories` — Get all categories (system + user custom)

Optional query: `?type=expense` — filter by type (`income`, `expense`, `saving`, `all`).

**Response `200`**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7a8b9c0d4",
      "name": "Food",
      "icon": "FaUtensils",
      "type": "expense",
      "color": "#FF6B6B",
      "isSystem": true
    },
    {
      "_id": "...",
      "name": "My Custom",
      "icon": "FaStar",
      "type": "expense",
      "color": "#4ECDC4",
      "isSystem": false
    }
  ]
}
```

---

#### `POST /api/categories` — Create a custom category

**Request**
```json
{
  "name": "Side Business",
  "icon": "FaBriefcase",
  "type": "income",
  "color": "#45B7D1"
}
```

**Response `201`** — Created category object (without `userId`).

---

#### `PUT /api/categories/:id` — Update a custom category

**Request** — Same fields as `POST`, all optional.  
**Response `200`** — Updated category.

---

#### `DELETE /api/categories/:id` — Delete a custom category

**Response `200`**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

> ⚠️ **System categories** (`isSystem: true`) cannot be edited or deleted.

---

### Budget Routes *(Protected)*

**Base:** `/api/budgets`

---

#### `GET /api/budgets` — Get budgets for a month/year

**Required query:** `?month=6&year=2025`

**Response `200`**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "category": {
        "_id": "...",
        "name": "Food",
        "icon": "FaUtensils",
        "color": "#FF6B6B"
      },
      "amount": 5000,
      "spent": 3200,
      "remaining": 1800,
      "percentage": 64,
      "month": 6,
      "year": 2025
    }
  ]
}
```

---

#### `POST /api/budgets` — Create a budget

**Request**
```json
{
  "categoryId": "65f1a2b3c4d5e6f7a8b9c0d3",
  "amount": 5000,
  "month": 6,
  "year": 2025
}
```

**Response `201`** — Created budget object.

---

#### `PUT /api/budgets/:id` — Update a budget

**Request** — Same as `POST`.  
**Response `200`** — Updated budget.

---

#### `DELETE /api/budgets/:id` — Delete a budget

**Response `200`** — Standard success response.

---

### Report Routes *(Protected)*

**Base:** `/api/reports`

---

#### `GET /api/reports/monthly-summary`

**Query:** `?month=6&year=2025`

**Response `200`**
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

---

#### `GET /api/reports/monthly-trend`

**Query:** `?year=2025&months=6` (last N months, up to 6)

**Response `200`**
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

**Query:** `?month=6&year=2025&type=expense` (`type` defaults to `expense`)

**Response `200`**
```json
{
  "success": true,
  "data": [
    { "category": "Food", "color": "#FF6B6B", "total": 4000, "percentage": 33.33 },
    { "category": "Transport", "color": "#4ECDC4", "total": 2000, "percentage": 16.67 }
  ]
}
```

---

### Export Routes *(Protected)*

**Base:** `/api/export`

#### `GET /api/export/excel` — Download entries as Excel (`.xlsx`)

Query parameters — same as `GET /api/entries` filters (`month`, `year`, `type`, `categoryId`).  
**Response** — Binary file with `Content-Disposition: attachment`.

#### `GET /api/export/pdf` — Download entries as PDF

Query parameters — same as above.  
**Response** — PDF file download.

---

## Data Models (TypeScript)

```ts
// User
interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

// Category
interface Category {
  _id: string;
  name: string;
  icon: string;         // react-icons key or emoji
  type: 'income' | 'expense' | 'saving' | 'all';
  color: string;        // hex: #RRGGBB
  isSystem: boolean;    // true = read-only
}

// Entry (Transaction)
interface Entry {
  _id: string;
  type: 'income' | 'expense' | 'saving';
  amount: number;
  category: Category;   // populated object
  date: string;         // ISO date
  note?: string;
  month: number;
  year: number;
  createdAt: string;
  updatedAt: string;
}

// Budget (with spent calculation)
interface Budget {
  _id: string;
  category: Category;
  amount: number;       // budget limit
  spent: number;        // sum of expenses in that category for the month
  remaining: number;
  percentage: number;   // (spent / amount) * 100, capped at 100
  month: number;
  year: number;
}

// Monthly Summary
interface MonthlySummary {
  month: number;
  year: number;
  totalIncome: number;
  totalExpense: number;
  totalSaving: number;
  remainingAfterSaving: number;   // income - saving
  remainingAfterExpense: number;  // (income - saving) - expense
  carriedOverSavings: number;     // surplus from previous month
  effectiveSavings: number;       // totalSaving + surplus
}

// Pagination
interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Generic API Response
interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: PaginationMeta;
  message?: string;
}
```

---

## Error Handling

All errors follow the same format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": [
    { "field": "email", "message": "Invalid email address" }
  ]
}
```

### HTTP Status Codes

| Code | Meaning                                         |
| ---- | ----------------------------------------------- |
| 200  | OK                                              |
| 201  | Created                                         |
| 400  | Validation error (invalid input)                |
| 401  | Unauthorized (missing/invalid token)            |
| 403  | Forbidden (accessing another user's data)       |
| 404  | Resource not found                              |
| 409  | Conflict (e.g., duplicate email, budget exists) |
| 500  | Internal server error                           |

### Client-Side Handling Recommendations

- **401** → Redirect to login page, clear stored token.
- **409** → Show user-friendly message (e.g., *"Budget already exists for this category and month"*).
- **400/422** → Display field-specific errors from the `errors` array.

---

## Example Integration Snippets

### Fetch wrapper (with token)

```js
// lib/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function apiClient(endpoint, options = {}) {
  const token = localStorage.getItem('token'); // or cookie
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await response.json();
  if (!response.ok) {
    throw { status: response.status, ...json };
  }
  return json;
}

// Usage
export const getEntries = (filters) =>
  apiClient(`/entries?${new URLSearchParams(filters)}`);
```

---

### Create an entry (React Hook)

```js
const createEntry = async (entryData) => {
  try {
    const res = await apiClient('/entries', {
      method: 'POST',
      body: JSON.stringify(entryData),
    });
    toast.success('Entry added');
    return res.data;
  } catch (err) {
    toast.error(err.message);
    throw err;
  }
};
```

---

### Download Excel report

```js
const downloadExcel = async (filters) => {
  const token = localStorage.getItem('token');
  const query = new URLSearchParams(filters).toString();
  const response = await fetch(`${API_URL}/export/excel?${query}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions_${Date.now()}.xlsx`;
  a.click();
};
```

---

## Important Business Rules

### Monthly Financial Logic

- `totalSaving` is the sum of entries with `type: "saving"` — money set aside at the start of the month.
- `effectiveSavings = totalSaving + max(0, totalIncome - totalSaving - totalExpense)` (surplus carried over).
- `carriedOverSavings` in the monthly summary is the surplus from the previous month's `remainingAfterExpense` (if positive).

### Category Rules

- System categories (`isSystem: true`) **cannot** be edited or deleted.
- User-created categories support full CRUD.
- When a category is deleted, associated entries are **not** deleted — the `categoryId` reference remains (show a fallback like *"Deleted category"*). The backend returns `400` if entries exist and prevents deletion.

### Data Isolation

Every query includes `userId` automatically (from the JWT). A user can **never** see another user's data.

### Pagination Defaults

| Parameter   | Default |
| ----------- | ------- |
| `page`      | `1`     |
| `limit`     | `10`    |
| `sortBy`    | `date`  |
| `sortOrder` | `desc`  |

---

## Testing Checklist for Frontend Integration

- [ ] Signup and login work → token stored
- [ ] `GET /api/entries` returns paginated entries for the logged-in user only
- [ ] Creating an entry with a valid `categoryId` succeeds
- [ ] Category list includes both system and user custom categories
- [ ] User-created categories appear and can be edited/deleted
- [ ] Budget creation, retrieval (with `spent`/`remaining`/`percentage`) works
- [ ] Monthly summary shows correct carry-over logic
- [ ] Excel/PDF exports download files with the current filters applied
- [ ] Error responses (401, 409, 400) are displayed gracefully