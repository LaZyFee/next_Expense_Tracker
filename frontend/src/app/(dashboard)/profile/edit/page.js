import serverApiClient from '@/lib/ServerApiClient'
import ProfileSettingsForm from '@/components/ProfileSettingsForm'

async function getMe() {
    const res = await serverApiClient.get('/auth/me')
    return res.user || res.data?.user || null
}

export default async function EditProfilePage() {
    let user = null
    try {
        user = await getMe()
    } catch {
        user = null
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-8">
            <ProfileSettingsForm initialUser={user} />
        </div>
    )
}
