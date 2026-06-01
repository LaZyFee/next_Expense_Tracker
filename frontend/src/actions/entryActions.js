'use server'

import serverApiClient from '@/lib/ServerApiClient'
import { revalidateAppViews } from './refreshViews'

export async function createEntry(formData) {
    const payload = {
        type: formData.get('type'),
        amount: parseFloat(formData.get('amount')),
        categoryId: formData.get('categoryId'),
        date: formData.get('date'),
        note: formData.get('note'),
    }
    try {
        const res = await serverApiClient.post('/entries', payload)
        revalidateAppViews()
        return { success: true, data: res.data }
    } catch (err) {
        return { success: false, message: err.message }
    }
}

export async function updateEntry(id, formData) {
    const payload = {
        type: formData.get('type'),
        amount: parseFloat(formData.get('amount')),
        categoryId: formData.get('categoryId'),
        date: formData.get('date'),
        note: formData.get('note'),
    }
    try {
        const res = await serverApiClient.put(`/entries/${id}`, payload)
        revalidateAppViews()
        return { success: true, data: res.data }
    } catch (err) {
        return { success: false, message: err.message }
    }
}

export async function deleteEntry(id) {
    try {
        await serverApiClient.delete(`/entries/${id}`)
        revalidateAppViews()
        return { success: true }
    } catch (err) {
        return { success: false, message: err.message }
    }
}
