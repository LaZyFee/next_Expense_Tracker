import SummaryCards from '@/components/SummaryCards'
import RecentEntries from '@/components/RecentEntries'
import MonthlyBarChart from '@/components/Chart/MonthlyBarChart'
import CategoryPieChart from '@/components/Chart/CategoryPieChart'
import MonthYearPicker from '@/components/shared/ui/MonthYearPicker'
import { getDashboardData } from '@/actions/dashboardActions'

export default async function DashboardPage({ searchParams }) {
    const params = await searchParams
    const now = new Date()
    const month = params.month ? parseInt(params.month) : now.getMonth() + 1
    const year = params.year ? parseInt(params.year) : now.getFullYear()

    const { summary, trend, breakdown, recent, period } = await getDashboardData(month, year)
    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Overview of your finances {period ? `for ${period.month}/${period.year}` : ''}
                </p>
                </div>
                <MonthYearPicker month={month} year={year} />
            </div>

            <SummaryCards summary={summary} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Monthly Trend</h3>
                    <MonthlyBarChart data={trend} />
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Expense Breakdown</h3>
                    <CategoryPieChart data={breakdown} />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
                <RecentEntries entries={recent} />
            </div>
        </div>
    )
}
