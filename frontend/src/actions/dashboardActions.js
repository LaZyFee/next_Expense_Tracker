'use server'

import serverApiClient from '@/lib/ServerApiClient'

export async function getDashboardData(month, year) {
    const now = new Date()
    const period = {
        month: Number(month) || now.getMonth() + 1,
        year: Number(year) || now.getFullYear(),
    }

    const [summary, trend, breakdown, recent] = await Promise.all([
        serverApiClient.get(`/reports/monthly-summary?month=${period.month}&year=${period.year}`),
        serverApiClient.get(`/reports/monthly-trend?year=${period.year}&months=6`),
        serverApiClient.get(`/reports/category-breakdown?month=${period.month}&year=${period.year}&type=expense`),
        serverApiClient.get('/entries?limit=5&sortBy=date&sortOrder=desc'),
    ])

    return {
        period,
        summary: summary.data,
        trend: trend.data,
        breakdown: breakdown.data,
        recent: recent.data,
    }
}

export async function getEntriesPageData({ page = '1', month, year }) {
    const params = new URLSearchParams({ page, limit: '10', sortBy: 'date', sortOrder: 'desc' })
    if (month) params.append('month', month)
    if (year) params.append('year', year)
    const res = await serverApiClient.get(`/entries?${params}`)
    return { entries: res.data, pagination: res.pagination }
}

export async function getReportsPageData(month, year) {
    const [trend, breakdown, summary] = await Promise.all([
        serverApiClient.get(`/reports/monthly-trend?year=${year}&months=6`),
        serverApiClient.get(`/reports/category-breakdown?month=${month}&year=${year}&type=expense`),
        serverApiClient.get(`/reports/monthly-summary?month=${month}&year=${year}`),
    ])
    return { trend: trend.data, breakdown: breakdown.data, summary: summary.data }
}

export async function getBudgetsPageData(month, year) {
    const [budgets, categories] = await Promise.all([
        serverApiClient.get(`/budgets?month=${month}&year=${year}`),
        serverApiClient.get('/categories'),
    ])
    return { budgets: budgets.data, categories: categories.data }
}
