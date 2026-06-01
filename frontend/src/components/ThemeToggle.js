'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { IoSunny, IoMoon } from 'react-icons/io5'

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    if (!mounted) return null

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-yellow-400 border border-gray-200 dark:border-slate-700 transition-all duration-200 hover:scale-105"
        >
            {theme === 'dark' ? <IoSunny size={20} /> : <IoMoon size={20} />}
        </button>
    )
}