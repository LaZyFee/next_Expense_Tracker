"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { signupSchema } from "@/schemas";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignupForm() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [errors, setErrors] = useState({});
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const result = signupSchema.safeParse(form);
        if (!result.success) {
            const fieldErrors = {};
            result.error.errors.forEach((err) => { fieldErrors[err.path[0]] = err.message; });
            setErrors(fieldErrors);
            return;
        }
        if (form.password !== form.confirmPassword) {
            setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Signup failed");

            document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
            await Swal.fire({ icon: "success", title: "Welcome!", text: "Account created successfully", confirmButtonColor: "#4f46e5", timer: 1500, showConfirmButton: false });
            router.push("/dashboard");
        } catch (err) {
            Swal.fire({ icon: "error", title: "Signup Failed", text: err.message, confirmButtonColor: "#4f46e5" });
        } finally {
            setLoading(false);
        }
    }

    const fields = [
        { name: "name", label: "Full Name", type: "text", placeholder: "John Doe", icon: FaUser },
        { name: "email", label: "Email", type: "email", placeholder: "you@example.com", icon: FaEnvelope },
        { name: "password", label: "Password", type: showPass ? "text" : "password", placeholder: "Min 8 chars, 1 uppercase, 1 number", icon: FaLock },
        { name: "confirmPassword", label: "Confirm Password", type: showPass ? "text" : "password", placeholder: "Repeat password", icon: FaLock },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ name, label, type, placeholder, icon: Icon }) => (
                <div key={name}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                    <div className="relative">
                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input
                            type={type} name={name} value={form[name]} onChange={handleChange} placeholder={placeholder}
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                        {(name === "password") && (
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                {showPass ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                            </button>
                        )}
                    </div>
                    {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
                </div>
            ))}

            <button
                type="submit" disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-2.5 rounded-xl font-medium text-sm transition-colors mt-2"
            >
                {loading ? "Creating account..." : "Create Account"}
            </button>
        </form>
    );
}