import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'

export default function DashboardLayout({ children, modal }) {
    return (
        <div className="flex min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <Sidebar />
            <main className="flex-1">
                {children}
                {modal}
            </main>
            <MobileNav />
        </div>
    )
}