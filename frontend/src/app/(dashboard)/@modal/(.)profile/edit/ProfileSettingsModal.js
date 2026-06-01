'use client'

import Modal from '@/components/shared/ui/Modal'
import ProfileSettingsForm from '@/components/ProfileSettingsForm'
import { useRouter } from 'next/navigation'

export default function ProfileSettingsModal({ user }) {
    const router = useRouter()
    return (
        <Modal isOpen={true} onClose={() => router.back()} title="Edit Profile" size="lg">
            <ProfileSettingsForm initialUser={user} compact onSuccess={() => router.back()} />
        </Modal>
    )
}
