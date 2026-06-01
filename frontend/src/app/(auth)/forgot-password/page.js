import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-indigo-600">Reset Password</h1>
                    <p className="text-gray-500 mt-2">We'll send you a reset link</p>
                </div>
                <ForgotPasswordForm />
                <p className="text-center text-sm text-gray-500 mt-6">
                    <a href="/login" className="text-indigo-600 hover:underline">Back to login</a>
                </p>
            </div>
        </div>
    );
}