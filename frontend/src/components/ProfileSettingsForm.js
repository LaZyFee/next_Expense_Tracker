'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export default function ProfileSettingsForm({ initialUser = null, compact = false, onSuccess }) {
    const router = useRouter()
    const [user, setUser] = useState(initialUser)
    const [loadingUser, setLoadingUser] = useState(!initialUser)
    const [isPending, startTransition] = useTransition()
    const [name, setName] = useState(initialUser?.name || '')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')

    useEffect(() => {
        if (initialUser) return
        const token = document.cookie.split('; ').find((row) => row.startsWith('token='))?.split('=')[1]
        if (!token) {
            router.push('/login')
            return
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (res) => {
                const data = await res.json()
                if (!res.ok) throw Object.assign(new Error(data.message || 'Session expired'), { code: data.code })
                setUser(data.user)
                setName(data.user?.name || '')
            })
            .catch(() => {
                document.cookie = 'token=; path=/; max-age=0'
                router.push('/login')
            })
            .finally(() => setLoadingUser(false))
    }, [initialUser, router])

    async function submitProfile(e) {
        e.preventDefault()
        startTransition(async () => {
            try {
                const token = document.cookie.split('; ').find((row) => row.startsWith('token='))?.split('=')[1]
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name }),
                })
                const data = await res.json()
                if (!res.ok) throw new Error(data.message || 'Profile update failed')
                setUser(data.user)
                Swal.fire({ icon: 'success', title: 'Profile updated', timer: 1000, showConfirmButton: false })
                onSuccess?.()
                router.refresh()
            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Update Failed', text: err.message })
            }
        })
    }

    async function submitPassword(e) {
        e.preventDefault()
        startTransition(async () => {
            try {
                const token = document.cookie.split('; ').find((row) => row.startsWith('token='))?.split('=')[1]
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/password`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ currentPassword, newPassword }),
                })
                const data = await res.json()
                if (!res.ok) throw new Error(data.message || 'Password update failed')
                setCurrentPassword('')
                setNewPassword('')
                Swal.fire({ icon: 'success', title: 'Password updated', timer: 1000, showConfirmButton: false })
                onSuccess?.()
            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Update Failed', text: err.message })
            }
        })
    }

    if (loadingUser) return <p className="text-sm text-gray-500">Loading profile...</p>

    const inputClass = 'w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'

    return (
        <div className={`space-y-6 ${compact ? '' : 'max-w-3xl'}`}>
            <form onSubmit={submitProfile} className="space-y-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email cannot be changed.</p>
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input value={user?.email || ''} readOnly className={`${inputClass} cursor-not-allowed opacity-80`} />
                </div>
                <button type="submit" disabled={isPending} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
                    {isPending ? 'Saving...' : 'Save Profile'}
                </button>
            </form>

            <form onSubmit={submitPassword} className="space-y-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Use a new password for future logins.</p>
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputClass} />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} />
                </div>
                <button type="submit" disabled={isPending} className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60 dark:bg-gray-100 dark:text-gray-900">
                    {isPending ? 'Updating...' : 'Change Password'}
                </button>
            </form>
        </div>
    )
}
