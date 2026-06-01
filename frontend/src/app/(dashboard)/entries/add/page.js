import serverApiClient from '@/lib/ServerApiClient'
import EntryForm from '@/components/EntryForm'

async function getCategories() {
    const res = await serverApiClient.get('/categories')
    return res.data
}

async function getEntry(id) {
    const res = await serverApiClient.get(`/entries/${id}`)
    return res.data
}

export default async function AddEntryPage({ searchParams }) {
    const params = await searchParams
    const categories = await getCategories()
    const entry = params?.id ? await getEntry(params.id) : null
    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {entry ? 'Edit Transaction' : 'Add New Transaction'}
            </h1>
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6">
                <EntryForm categories={categories} entry={entry} />
            </div>
        </div>
    )
}
