import ReportsClient from '@/components/ReportsClient'
import ExportButtons from '@/components/ExportButtons'
import MonthYearPicker from '@/components/shared/ui/MonthYearPicker'
import { getReportsPageData } from '@/actions/dashboardActions'

export default async function ReportsPage({ searchParams }) {
    const params = await searchParams
    const now = new Date()
    const month = params.month ? parseInt(params.month) : now.getMonth() + 1
    const year = params.year ? parseInt(params.year) : now.getFullYear()

    const { trend, breakdown, summary } = await getReportsPageData(month, year)

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex flex-wrap justify-between items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Reports & Analytics</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Visualize your financial data</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <MonthYearPicker month={month} year={year} />
                    <ExportButtons filters={{ month, year }} />
                </div>
            </div>
            <ReportsClient trend={trend} categoryBreakdown={breakdown} summary={summary} month={month} year={year} />
        </div>
    )
}
