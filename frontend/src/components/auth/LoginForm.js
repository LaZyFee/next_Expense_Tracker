"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { loginSchema } from "@/schemas";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginForm() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const result = loginSchema.safeParse(form);
        if (!result.success) {
            const fieldErrors = {};
            result.error.errors.forEach((err) => {
                fieldErrors[err.path[0]] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");

            // Store token in cookie
            document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
            router.push("/dashboard");
        } catch (err) {
            Swal.fire({ icon: "error", title: "Login Failed", text: err.message, confirmButtonColor: "#4f46e5" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                        type="email" name="email" value={form.email} onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                        type={showPass ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPass ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div className="text-right">
                <a href="/forgot-password" className="text-xs text-indigo-600 hover:underline">Forgot password?</a>
            </div>
            <button
                type="submit" disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-2.5 rounded-xl font-medium text-sm transition-colors"
            >
                {loading ? "Signing in..." : "Sign In"}
            </button>
        </form>
    );
}