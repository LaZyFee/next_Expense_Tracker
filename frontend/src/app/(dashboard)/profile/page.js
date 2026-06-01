import serverApiClient from '@/lib/ServerApiClient'
import ProfileSettingsForm from '@/components/ProfileSettingsForm'

async function getMe() {
    const res = await serverApiClient.get('/auth/me')
    return res.user || res.data?.user || null
}

export default async function ProfilePage() {
    let user = null
    try {
        user = await getMe()
    } catch {
        user = null
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Profile</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your name and password.</p>
            </div>
            <ProfileSettingsForm initialUser={user} />
        </div>
    )
}
