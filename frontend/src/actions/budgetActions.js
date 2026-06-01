'use server'

import serverApiClient from '@/lib/ServerApiClient'
import { revalidateAppViews } from './refreshViews'

export async function createBudget(data) {
    try {
        const res = await serverApiClient.post('/budgets', data)
        revalidateAppViews()
        return { success: true, data: res.data }
    } catch (err) {
        return { success: false, message: err.message }
    }
}

export async function updateBudget(id, data) {
    try {
        const res = await serverApiClient.put(`/budgets/${id}`, data)
        revalidateAppViews()
        return { success: true, data: res.data }
    } catch (err) {
        return { success: false, message: err.message }
    }
}

export async function deleteBudget(id) {
    try {
        await serverApiClient.delete(`/budgets/${id}`)
        revalidateAppViews()
        return { success: true }
    } catch (err) {
        return { success: false, message: err.message }
    }
}
