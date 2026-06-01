'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa'

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
]

function parseDate(value) {
    if (!value) return null
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? null : d
}

function pad(n) {
    return String(n).padStart(2, '0')
}

function buildCalendar(year, month) {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrev = new Date(year, month, 0).getDate()
    const cells = []

    for (let i = firstDay - 1; i >= 0; i--) {
        cells.push({
            day: daysInPrev - i,
            month: month === 0 ? 11 : month - 1,
            year: month === 0 ? year - 1 : year,
            outside: true,
        })
    }

    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ day: d, month, year, outside: false })
    }

    while (cells.length < 42) {
        const d = cells.length - daysInMonth - firstDay + 1
        cells.push({
            day: d,
            month: month === 11 ? 0 : month + 1,
            year: month === 11 ? year + 1 : year,
            outside: true,
        })
    }

    return cells
}

export default function DatePickerField({
    value,
    onChange,
    label = 'Date',
    placeholder = 'Select date',
    maxDate = new Date(),
}) {
    const [open, setOpen] = useState(false)
    const [viewDate, setViewDate] = useState(parseDate(value) || new Date())
    const parsed = parseDate(value)
    const wrapperRef = useRef(null)

    useEffect(() => {
        setViewDate(parsed || new Date())
    }, [parsed?.getTime()])

    useEffect(() => {
        const onClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', onClickOutside)
        return () => document.removeEventListener('mousedown', onClickOutside)
    }, [])

    const selectedDate = parsed
    const cells = useMemo(() => buildCalendar(viewDate.getFullYear(), viewDate.getMonth()), [viewDate])
    const today = new Date()

    const handleSelect = (cell) => {
        const d = new Date(cell.year, cell.month, cell.day)
        if (d > maxDate) return
        onChange?.(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`)
        setViewDate(d)
        setOpen(false)
    }

    const displayValue = selectedDate
        ? selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : ''

    return (
        <div ref={wrapperRef} className="relative w-full">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-900 shadow-sm transition hover:border-indigo-500 hover:ring-4 hover:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
                <FaCalendarAlt className="text-indigo-500" />
                <span className={selectedDate ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
                    {displayValue || placeholder}
                </span>
                {selectedDate && (
                    <span
                        className="ml-auto rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onChange?.('')
                        }}
                    >
                        <FaTimes size={12} />
                    </span>
                )}
            </button>

            {open && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[70] flex items-start justify-center bg-black/35 px-3 py-4 backdrop-blur-sm sm:items-center">
                    <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl dark:bg-gray-900">
                        <div className="flex items-center justify-between border-b border-gray-200/80 px-4 py-3 dark:border-gray-700/80">
                            <button
                                type="button"
                                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                                className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <FaChevronLeft size={12} />
                            </button>
                            <div className="text-center">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {MONTHS[viewDate.getMonth()]}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{viewDate.getFullYear()}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                                className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <FaChevronRight size={12} />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 px-4 pt-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                                <div key={d}>{d}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1 px-4 py-4">
                            {cells.map((cell, idx) => {
                                const d = new Date(cell.year, cell.month, cell.day)
                                const disabled = d > maxDate
                                const isToday =
                                    d.getDate() === today.getDate() &&
                                    d.getMonth() === today.getMonth() &&
                                    d.getFullYear() === today.getFullYear()
                                const isSelected =
                                    selectedDate &&
                                    d.getDate() === selectedDate.getDate() &&
                                    d.getMonth() === selectedDate.getMonth() &&
                                    d.getFullYear() === selectedDate.getFullYear()

                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        disabled={disabled}
                                        onClick={() => handleSelect(cell)}
                                        className={`flex h-10 items-center justify-center rounded-full text-sm font-medium transition ${
                                            cell.outside
                                                ? 'text-gray-300 dark:text-gray-700'
                                                : isSelected
                                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                                    : isToday
                                                        ? 'border border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                                        : 'text-gray-700 hover:bg-indigo-50 dark:text-gray-200 dark:hover:bg-gray-800'
                                        } ${disabled ? 'cursor-not-allowed opacity-30' : ''}`}
                                    >
                                        {cell.day}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}
