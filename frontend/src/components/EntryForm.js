"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { FaRegStickyNote, FaTag, FaWallet } from "react-icons/fa";
import { entrySchema } from "@/schemas";
import { createEntry, updateEntry } from "@/actions/entryActions";
import DatePickerField from "@/components/shared/ui/DatePickerField";

const TYPES = [
    { key: "income", label: "Income", accent: "emerald" },
    { key: "expense", label: "Expense", accent: "rose" },
    { key: "saving", label: "Saving", accent: "sky" },
];

export default function EntryForm({ categories = [], entry = null, onSuccess }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [type, setType] = useState(entry?.type || "expense");
    const [amount, setAmount] = useState(entry?.amount?.toString() || "");
    const [categoryId, setCategoryId] = useState(entry?.category?._id || "");
    const [date, setDate] = useState(entry ? new Date(entry.date) : new Date());
    const [note, setNote] = useState(entry?.note || "");
    const [errors, setErrors] = useState({});

    const filteredCategories = useMemo(
        () => categories.filter((c) => c.type === type || c.type === "all"),
        [categories, type]
    );

    async function handleSubmit(e) {
        e.preventDefault();
        const payload = {
            type,
            amount: parseFloat(amount),
            categoryId,
            date: date ? date.toISOString().split("T")[0] : "",
            note,
        };

        const result = entrySchema.safeParse(payload);
        if (!result.success) {
            const fieldErrors = {};
            result.error.errors.forEach((err) => {
                fieldErrors[err.path[0]] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        const formData = new FormData();
        Object.entries(payload).forEach(([k, v]) => formData.append(k, v));

        startTransition(async () => {
            const res = entry ? await updateEntry(entry._id, formData) : await createEntry(formData);

            if (res.success) {
                await Swal.fire({
                    icon: "success",
                    title: entry ? "Transaction updated" : "Transaction saved",
                    timer: 900,
                    showConfirmButton: false,
                });
                if (onSuccess) onSuccess();
                else router.push("/entries");
            } else {
                Swal.fire({ icon: "error", title: "Error", text: res.message, confirmButtonColor: "#4f46e5" });
            }
        });
    }

    const inputClass =
        "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white [appearance:textfield] [-moz-appearance:textfield]";
    const labelClass = "mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-3">
                {TYPES.map((item) => {
                    const active = type === item.key;
                    const accentMap = {
                        emerald: active ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400",
                        rose: active ? "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400",
                        sky: active ? "border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400",
                    };
                    return (
                        <button
                            key={item.key}
                            type="button"
                            onClick={() => {
                                setType(item.key);
                                setCategoryId("");
                            }}
                            className={`rounded-2xl border px-4 py-4 text-left text-sm font-medium transition-all ${accentMap[item.accent]}`}
                        >
                            <div className="flex items-center justify-between">
                                <span>{item.label}</span>
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className={labelClass}>Amount</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            inputMode="decimal"
                            className={inputClass}
                        />
                    </div>
                    {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
                </div>

                <div>
                    <DatePickerField
                        value={date?.toISOString?.().split('T')[0] || ''}
                        onChange={(value) => setDate(value ? new Date(value) : null)}
                        label="Date"
                        maxDate={new Date()}
                    />
                    {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
                </div>
            </div>

            <div>
                <label className={labelClass}>Category</label>
                <div className="relative">
                    <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className={`${inputClass} pl-10`}
                    >
                        <option value="">Select category...</option>
                        {filteredCategories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                {errors.categoryId && <p className="mt-1 text-xs text-red-500">{errors.categoryId}</p>}
            </div>

            <div>
                <label className={labelClass}>
                    Note <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <div className="relative">
                    <FaRegStickyNote className="absolute left-4 top-4 text-gray-400" size={14} />
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add a short note about this transaction..."
                        rows={4}
                        maxLength={500}
                        className={`${inputClass} min-h-28 resize-none pl-10 pt-3`}
                    />
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
                    <span>Optional note for better tracking.</span>
                    <span>{note.length}/500</span>
                </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row dark:border-gray-800">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                >
                    {isPending ? "Saving..." : entry ? "Update Transaction" : "Add Transaction"}
                </button>
            </div>
        </form>
    );
}
