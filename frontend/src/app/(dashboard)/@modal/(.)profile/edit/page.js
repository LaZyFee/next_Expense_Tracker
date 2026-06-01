import serverApiClient from '@/lib/ServerApiClient'
import ProfileSettingsModal from './ProfileSettingsModal'

async function getMe() {
    const res = await serverApiClient.get('/auth/me')
    return res.user || res.data?.user || null
}

export default async function InterceptedProfileEditPage() {
    let user = null
    try {
        user = await getMe()
    } catch {
        user = null
    }

    return <ProfileSettingsModal user={user} />
}
