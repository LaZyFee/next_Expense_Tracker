import serverApiClient from '@/lib/ServerApiClient'
import CategoriesManager from '@/components/CategoriesManager'

async function getCategories() {
    const res = await serverApiClient.get('/categories')
    return res.data
}

export default async function CategoriesPage() {
    const categories = await getCategories()
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Categories</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your custom categories</p>
            </div>
            <CategoriesManager initialCategories={categories} />
        </div>
    )
}