import EntriesTable from '@/components/EntriesTable'
import ExportButtons from '@/components/ExportButtons'
import MonthYearPicker from '@/components/shared/ui/MonthYearPicker'
import Link from 'next/link'
import { getEntriesPageData } from '@/actions/dashboardActions'

export default async function EntriesPage({ searchParams }) {
    const params = await searchParams
    const page = params.page || '1'
    const now = new Date()
    const month = params.month ? parseInt(params.month) : now.getMonth() + 1
    const year = params.year ? parseInt(params.year) : now.getFullYear()

    const { entries, pagination } = await getEntriesPageData({ page, month, year })

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex flex-wrap justify-between items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Transactions</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your income, expenses, and savings</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <MonthYearPicker month={month} year={year} />
                    <ExportButtons filters={{ month, year }} />
                    <Link href="/entries/add" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition">
                        + Add Entry
                    </Link>
                </div>
            </div>
            <EntriesTable initialEntries={entries} initialPagination={pagination} />
        </div>
    )
}
