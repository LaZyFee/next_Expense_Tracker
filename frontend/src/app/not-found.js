import Link from 'next/link'
import { FaArrowLeft, FaChartLine, FaHome, FaSearch } from 'react-icons/fa'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50 px-4 py-10 text-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 dark:text-white">
            <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center">
                <div className="grid w-full gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="animate-fadeUp space-y-6">
                        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-indigo-600 shadow-sm dark:border-indigo-900/60 dark:bg-gray-900 dark:text-indigo-400">
                            <FaSearch size={12} />
                            Page unavailable
                        </div>

                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.3em] text-gray-500 dark:text-gray-500">
                                Error 404
                            </p>
                            <h1 className="mt-4 max-w-xl font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl">
                                We couldn&apos;t find that page.
                            </h1>
                            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
                                The route may have moved, the link may be outdated, or the page might not exist yet.
                                Use the dashboard to continue managing your finances.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                            >
                                <FaHome size={13} />
                                Go to Dashboard
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-indigo-300"
                            >
                                <FaArrowLeft size={13} />
                                Back Home
                            </Link>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            {[
                                { label: 'Track entries', value: 'Fast' },
                                { label: 'Review budgets', value: 'Live' },
                                { label: 'Explore reports', value: 'Ready' },
                            ].map((item) => (
                                <div key={item.label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-500">{item.label}</p>
                                    <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="animate-fadeUp [animation-delay:200ms]">
                        <div className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900">
                            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-indigo-500/15 blur-3xl" />
                            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-sky-500/15 blur-3xl" />

                            <div className="relative space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-500">ExpenseFlow</p>
                                        <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">Lost route</p>
                                    </div>
                                    <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                                        <FaChartLine size={18} />
                                    </div>
                                </div>

                                <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/60">
                                    <div className="flex items-end justify-between gap-4">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-500">Current view</p>
                                            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">404</p>
                                        </div>
                                        <div className="h-20 w-28 rounded-2xl bg-gradient-to-t from-indigo-600/20 to-indigo-600/0 dark:from-indigo-400/20" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {['Dashboard', 'Entries', 'Reports', 'Budgets'].map((item) => (
                                        <div key={item} className="rounded-2xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
