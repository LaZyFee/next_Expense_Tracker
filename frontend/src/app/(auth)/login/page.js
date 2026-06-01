import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">ExpenseFlow</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to your account</p>
                </div>
                <LoginForm />
                <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account?{' '}
                    <a href="/signup" className="text-indigo-600 hover:underline">Sign up</a>
                </p>
            </div>
        </div>
    )
}