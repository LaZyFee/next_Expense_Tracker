'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'
import { FaUserCircle, FaChevronDown, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa'

export default function Navbar() {
    const pathname = usePathname()
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [dropdownOpen, setDropdownOpen] = useState(false)

    useEffect(() => {
        const token = document.cookie.split('; ').find((row) => row.startsWith('token='))?.split('=')[1]
        if (token) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) setUser(data.user)
                })
                .catch((error) => {
                    if (error?.code === 'TOKEN_EXPIRED') handleLogout()
                    else setUser({ name: 'User' })
                })
        }
    }, [])

    const handleLogout = () => {
        document.cookie = 'token=; path=/; max-age=0'
        router.push('/login')
    }

    if (pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password' || pathname === '/reset-password') {
        return null
    }

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-gray-900/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600 dark:text-indigo-400">
                        ExpenseFlow
                    </Link>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 rounded-xl px-3 py-2 shadow-sm transition hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
                                >
                                    <FaUserCircle size={20} />
                                    <span className="hidden text-sm font-medium sm:inline">{user.name || 'User'}</span>
                                    <FaChevronDown size={12} />
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-gray-200/80 bg-white/95 shadow-lg backdrop-blur-md dark:border-gray-700/80 dark:bg-gray-800/95">
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <FaTachometerAlt size={14} /> Dashboard
                                        </Link>
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <FaUserCircle size={14} /> Profile
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setDropdownOpen(false)
                                                handleLogout()
                                            }}
                                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            <FaSignOutAlt size={14} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-indigo-600 dark:text-gray-300">
                                    Sign In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
