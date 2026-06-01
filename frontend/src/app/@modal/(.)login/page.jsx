'use client'

import Modal from '@/components/shared/ui/Modal'
import LoginForm from '@/components/auth/LoginForm'
import { useRouter } from 'next/navigation'

export default function InterceptedLoginPage() {
    const router = useRouter()

    return (
        <Modal isOpen={true} onClose={() => router.back()} title="Sign In">
            <div className="p-2">
                <LoginForm />
            </div>
        </Modal>
    )
}
