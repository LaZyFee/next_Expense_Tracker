"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Swal from "sweetalert2";
import { budgetSchema } from "@/schemas";
import { createBudget, updateBudget, deleteBudget } from "@/actions/budgetActions";
import { formatCurrency } from "@/lib/utils";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Modal from "./shared/ui/Modal";

export default function BudgetsManager({ initialBudgets = [], categories = [], month, year }) {
    const router = useRouter();
    const [budgets, setBudgets] = useState(initialBudgets);
    const [isPending, startTransition] = useTransition();
    const [modal, setModal] = useState({ open: false, budget: null });
    const [form, setForm] = useState({ categoryId: "", amount: "" });
    const [errors, setErrors] = useState({});

    function openAdd() {
        setForm({ categoryId: "", amount: "" });
        setErrors({});
        setModal({ open: true, budget: null });
    }

    function openEdit(budget) {
        setForm({ categoryId: budget.category._id, amount: budget.amount.toString() });
        setErrors({});
        setModal({ open: true, budget });
    }

    async function handleSubmit() {
        const payload = { categoryId: form.categoryId, amount: parseFloat(form.amount), month, year };
        const result = budgetSchema.safeParse(payload);
        if (!result.success) {
            const fieldErrors = {};
            result.error.errors.forEach((e) => { fieldErrors[e.path[0]] = e.message; });
            setErrors(fieldErrors);
            return;
        }

        startTransition(async () => {
            const res = modal.budget
                ? await updateBudget(modal.budget._id, payload)
                : await createBudget(payload);

            if (res.success) {
                setModal({ open: false, budget: null });
                router.refresh();
            } else {
                Swal.fire({ icon: "error", title: "Error", text: res.message });
            }
        });
    }

    async function handleDelete(budget) {
        const confirm = await Swal.fire({
            icon: "warning", title: "Delete Budget?", showCancelButton: true,
            confirmButtonColor: "#ef4444", confirmButtonText: "Delete",
        });
        if (!confirm.isConfirmed) return;
        startTransition(async () => {
            const res = await deleteBudget(budget._id);
            if (res.success) router.refresh();
        });
    }

    function getBarColor(pct) {
        if (pct >= 85) return "bg-red-500";
        if (pct >= 60) return "bg-yellow-500";
        return "bg-green-500";
    }

    const inputClass = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button onClick={openAdd} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                    <FaPlus size={12} /> Set Budget
                </button>
            </div>

            {budgets.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center text-gray-400">
                    <p className="text-lg">No budgets set for this month</p>
                    <p className="text-sm mt-1">Click "Set Budget" to add spending limits</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {budgets.map((budget) => (
                        <div key={budget._id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-100">{budget.category.name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {formatCurrency(budget.spent)} of {formatCurrency(budget.amount)}
                                    </p>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => openEdit(budget)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors">
                                        <FaEdit size={12} />
                                    </button>
                                    <button onClick={() => handleDelete(budget)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500 transition-colors">
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${getBarColor(budget.percentage)}`}
                                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                                />
                            </div>
                            <div className="flex justify-between mt-1.5">
                                <span className={`text-xs font-medium ${budget.percentage >= 85 ? "text-red-500" : budget.percentage >= 60 ? "text-yellow-500" : "text-green-500"}`}>
                                    {budget.percentage}% used
                                </span>
                                <span className="text-xs text-gray-400">
                                    {formatCurrency(budget.remaining)} left
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal isOpen={modal.open} onClose={() => setModal({ open: false, budget: null })} title={modal.budget ? "Edit Budget" : "Set Budget"}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                        <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className={inputClass}>
                            <option value="">Select category...</option>
                            {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                        </select>
                        {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget Amount (৳)</label>
                        <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="5000" min="0" className={inputClass} />
                        {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button onClick={() => setModal({ open: false, budget: null })} className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                        <button onClick={handleSubmit} disabled={isPending} className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
                            {isPending ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
