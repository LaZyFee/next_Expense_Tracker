import serverApiClient from '@/lib/ServerApiClient'
import EntryFormModal from './EntryFormModal'

async function getCategories() {
    const res = await serverApiClient.get('/categories')
    return res.data
}

async function getEntry(id) {
    const res = await serverApiClient.get(`/entries/${id}`)
    return res.data
}

export default async function InterceptedAddEntryPage({ searchParams }) {
    const params = await searchParams
    const categories = await getCategories()
    const entry = params?.id ? await getEntry(params.id) : null

    return <EntryFormModal categories={categories} entry={entry} />
}
