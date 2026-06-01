'use server'

import serverApiClient from '@/lib/ServerApiClient'
import { revalidateAppViews } from './refreshViews'

export async function createCategory(data) {
    try {
        const res = await serverApiClient.post('/categories', data)
        revalidateAppViews()
        return { success: true, data: res.data }
    } catch (err) {
        return { success: false, message: err.message }
    }
}

export async function updateCategory(id, data) {
    try {
        const res = await serverApiClient.put(`/categories/${id}`, data)
        revalidateAppViews()
        return { success: true, data: res.data }
    } catch (err) {
        return { success: false, message: err.message }
    }
}

export async function deleteCategory(id) {
    try {
        await serverApiClient.delete(`/categories/${id}`)
        revalidateAppViews()
        return { success: true }
    } catch (err) {
        return { success: false, message: err.message }
    }
}
