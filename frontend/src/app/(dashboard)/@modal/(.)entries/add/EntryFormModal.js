'use client'

import Modal from '@/components/shared/ui/Modal'
import EntryForm from '@/components/EntryForm'
import { useRouter } from 'next/navigation'

export default function EntryFormModal({ categories, entry = null }) {
    const router = useRouter()

    const handleClose = () => {
        router.back()
        router.refresh()
    }

    return (
        <Modal
            isOpen={true}
            onClose={handleClose}
            title={entry ? 'Edit Transaction' : 'Add Transaction'}
            size="lg"
        >
            <EntryForm
                categories={categories}
                entry={entry}
                onSuccess={handleClose}
            />
        </Modal>
    )
}
