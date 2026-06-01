'use client'

import Link from 'next/link'
import {useEffect, useState} from 'react'
import {FaArrowRight, FaChartLine, FaMobileAlt, FaPiggyBank, FaShieldAlt} from 'react-icons/fa'

const FEATURES = [
    {
        num: '01',
        icon: <FaChartLine className="text-lg"/>,
        name: 'Visual Reports',
        desc: 'Interactive charts and trend lines reveal exactly where your money goes each month.',
    },
    {
        num: '02',
        icon: <FaPiggyBank className="text-lg"/>,
        name: 'Smart Savings',
        desc: 'Surplus automatically carries forward to next month with no manual transfers needed.',
    },
    {
        num: '03',
        icon: <FaShieldAlt className="text-lg"/>,
        name: 'Secure & Private',
        desc: 'Your data stays isolated, protected, and never shared with third parties.',
    },
    {
        num: '04',
        icon: <FaMobileAlt className="text-lg"/>,
        name: 'Responsive Design',
        desc: 'Works smoothly on desktop, tablet, and mobile so you can track anywhere.',
    },
]

const TICKER_ITEMS = [
    'Visual Reports',
    'Smart Savings',
    'Secure & Private',
    'Responsive Design',
    'Auto Carry-Over',
    'Budget Tracking',
]

const BAR_HEIGHTS = ['h-[35%]', 'h-[55%]', 'h-[42%]', 'h-[70%]', 'h-[60%]', 'h-[88%]']

const STATS = [
    {label: 'Income', value: '$5,200', accent: false},
    {label: 'Expenses', value: '$3,180', accent: false},
    {label: 'Savings rate', value: '38.8%', accent: false},
    {label: 'Carried over', value: '+$840', accent: true},
]

export default function LandingPage() {
    const [dark, setDark] = useState(true)

    useEffect(() => {
        document.documentElement.classList.toggle('dark', dark)
    }, [dark])

    return (
        <div
            className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-slate-50 text-gray-900 transition-colors duration-300 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 dark:text-white">
            <section
                className="relative grid grid-cols-1 items-center gap-12 overflow-hidden px-6 py-20 sm:px-12 lg:grid-cols-2 lg:py-28">
                <div
                    className="hidden pointer-events-none lg:block absolute -right-30 top-1/2 h-125 w-125 -translate-y-1/2 rounded-full border border-indigo-100/80 dark:border-indigo-950/60"/>
                <div
                    className="hidden pointer-events-none lg:block absolute -right-55 top-1/2 h-180 w-180 -translate-y-1/2 rounded-full border border-slate-100 dark:border-gray-900"/>

                <div className="animate-fadeUp [animation-delay:100ms]">
                    <div
                        className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                        <span className="inline-block h-px w-6 bg-indigo-600 dark:bg-indigo-400"/>
                        Personal Finance
                    </div>

                    <h1 className="mb-6 font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                        Money, finally
                        <br/>
                        <em className="italic text-indigo-600 dark:text-indigo-400">under control</em>
                    </h1>

                    <p className="mb-10 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">
                        Track every dollar, set intelligent budgets, and watch your savings compound month after month,
                        all in one place.
                    </p>

                    <div className="flex flex-wrap items-center gap-6">
                        <Link
                            href="/signup"
                            className="rounded-full bg-indigo-600 px-7 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 active:scale-[0.98] dark:bg-indigo-500 dark:hover:bg-indigo-400"
                        >
                            Start Tracking - Free
                        </Link>
                        <Link
                            href="#features"
                            className="group inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-300"
                        >
                            See how it works
                            <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1"/>
                        </Link>
                    </div>
                </div>

                <div className="flex justify-center animate-fadeUp [animation-delay:300ms] lg:justify-end">
                    <DashboardCard/>
                </div>
            </section>

            <div
                className="overflow-hidden border-y border-gray-200 bg-white/70 py-3 backdrop-blur dark:border-gray-800 dark:bg-gray-950/40">
                <div
                    className="inline-flex whitespace-nowrap gap-12 animate-marquee text-xs uppercase tracking-widest text-gray-500 dark:text-gray-500">
                    {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                        <span key={i} className="inline-flex items-center gap-2">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400"/>
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            <section id="features" className="animate-fadeUp [animation-delay:400ms] px-6 py-20 sm:px-12 lg:py-24">
                <div
                    className="mb-10 flex flex-col gap-4 border-b border-gray-200 pb-6 dark:border-gray-800 sm:flex-row sm:items-end sm:justify-between">
                    <span className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-500">
                        01 - Features
                    </span>
                    <h2 className="font-serif text-3xl leading-tight tracking-tight sm:text-4xl">
                        Everything you need
                        <br/>
                        to manage money
                    </h2>
                </div>

                <div
                    className="grid grid-cols-1 overflow-hidden rounded-2xl border border-gray-200 bg-white/70 backdrop-blur divide-x divide-y divide-gray-200 dark:border-gray-800 dark:bg-gray-900/70 dark:divide-gray-800 sm:grid-cols-2 lg:grid-cols-4">
                    {FEATURES.map((f) => (
                        <FeatureCell key={f.num} {...f} />
                    ))}
                </div>
            </section>

            <div className="animate-fadeUp [animation-delay:500ms] px-6 pb-20 sm:px-12">
                <div
                    className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-indigo-600 p-10 sm:flex-row sm:items-center sm:p-14 dark:bg-indigo-500">
                    <div>
                        <h2 className="mb-2 font-serif text-3xl leading-tight tracking-tight text-white sm:text-4xl dark:text-gray-950">
                            Ready to start
                            <br/>
                            tracking smarter?
                        </h2>
                        <p className="text-sm text-indigo-100 dark:text-indigo-950">
                            Join thousands of users who already trust ExpenseFlow with their finances.
                        </p>
                    </div>
                    <Link
                        href="/signup"
                        className="shrink-0 rounded-full bg-white px-8 py-3.5 text-sm font-medium text-gray-900 shadow-lg transition-opacity hover:opacity-90 dark:bg-gray-950 dark:text-white"
                    >
                        Create Free Account
                    </Link>
                </div>
            </div>
            <footer
                className="border-t border-stone-200 dark:border-stone-800 px-6 sm:px-12 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-stone-400 dark:text-stone-600">
                <span>© 2026 ExpenseFlow. All rights reserved.</span>
                <Link
                    href="https://rabiul-rafee-portfolio.netlify.app/"
                    className="hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
                >
                    @LaZyFee
                </Link>
            </footer>

        </div>
    )
}

function DashboardCard() {
    return (
        <div
            className="relative w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div
                className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-400/10"/>

            <p className="mb-1 text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-500">
                Total Balance
            </p>
            <p className="mb-1 font-serif text-5xl tracking-tight text-gray-900 dark:text-white">
                $8,420
            </p>
            <p className="mb-5 text-xs text-indigo-600 dark:text-indigo-400">
                +12.4% this month
            </p>

            <div className="mb-5 flex h-16 items-end gap-1.5">
                {BAR_HEIGHTS.map((h, i) => (
                    <div
                        key={i}
                        className={`flex-1 rounded-t ${h} ${
                            i === BAR_HEIGHTS.length - 1
                                ? 'bg-indigo-600 dark:bg-indigo-400'
                                : 'bg-gray-100 dark:bg-gray-800'
                        }`}
                    />
                ))}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
                {STATS.map(({label, value, accent}) => (
                    <div key={label} className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/80">
                        <p className="mb-1 text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-500">
                            {label}
                        </p>
                        <p className={`text-sm font-medium ${accent ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-white'}`}>
                            {value}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

function FeatureCell({num, icon, name, desc}) {
    return (
        <div
            className="group cursor-default bg-white p-7 transition-colors duration-300 hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800/40">
            <div
                className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-indigo-600 transition-colors duration-300 group-hover:border-indigo-400 dark:border-gray-700 dark:bg-gray-800 dark:text-indigo-400 dark:group-hover:border-indigo-500">
                {icon}
            </div>
            <p className="mb-1 text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-500">
                {num}
            </p>
            <h3 className="mb-2 font-serif text-xl tracking-tight text-gray-900 dark:text-white">
                {name}
            </h3>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {desc}
            </p>
        </div>
    )
}
