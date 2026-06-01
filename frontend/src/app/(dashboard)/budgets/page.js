import BudgetsManager from '@/components/BudgetManager'
import MonthYearPicker from '@/components/shared/ui/MonthYearPicker'
import { getBudgetsPageData } from '@/actions/dashboardActions'

export default async function BudgetsPage({ searchParams }) {
    const params = await searchParams
    const now = new Date()
    const month = params.month ? parseInt(params.month) : now.getMonth() + 1
    const year = params.year ? parseInt(params.year) : now.getFullYear()

    const { budgets, categories } = await getBudgetsPageData(month, year)

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex flex-wrap justify-between items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Budgets</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Set spending limits per category</p>
                </div>
                <MonthYearPicker month={month} year={year} />
            </div>
            <BudgetsManager initialBudgets={budgets} categories={categories} month={month} year={year} />
        </div>
    )
}
