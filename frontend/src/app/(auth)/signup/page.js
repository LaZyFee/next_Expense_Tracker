import SignupForm from '@/components/auth/SignupForm'

export default function SignupPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">ExpenseFlow</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Create your account</p>
                </div>
                <SignupForm />
                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{' '}
                    <a href="/login" className="text-indigo-600 hover:underline">Sign in</a>
                </p>
            </div>
        </div>
    )
}