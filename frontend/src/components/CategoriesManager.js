"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Swal from "sweetalert2";
import Modal from "./shared/ui/Modal";
import { categorySchema } from "@/schemas";
import { createCategory, updateCategory, deleteCategory } from "@/actions/categoryActions";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const ICON_OPTIONS = [
    "FaUtensils", "FaCar", "FaShoppingBag", "FaBolt", "FaHeart",
    "FaFilm", "FaBriefcase", "FaHome", "FaGraduationCap", "FaPlane",
    "FaPiggyBank", "FaChartLine", "FaStar", "FaGift", "FaMobile",
];

const TYPE_OPTIONS = ["income", "expense", "saving", "all"];

export default function CategoriesManager({ initialCategories = [] }) {
    const router = useRouter();
    const [categories, setCategories] = useState(initialCategories);
    const [isPending, startTransition] = useTransition();
    const [modal, setModal] = useState({ open: false, category: null });
    const [form, setForm] = useState({ name: "", icon: "FaStar", type: "expense", color: "#4f46e5" });
    const [errors, setErrors] = useState({});

    function openAdd() {
        setForm({ name: "", icon: "FaStar", type: "expense", color: "#4f46e5" });
        setErrors({});
        setModal({ open: true, category: null });
    }

    function openEdit(cat) {
        setForm({ name: cat.name, icon: cat.icon, type: cat.type, color: cat.color });
        setErrors({});
        setModal({ open: true, category: cat });
    }

    async function handleSubmit() {
        const result = categorySchema.safeParse(form);
        if (!result.success) {
            const fieldErrors = {};
            result.error.errors.forEach((e) => { fieldErrors[e.path[0]] = e.message; });
            setErrors(fieldErrors);
            return;
        }

        startTransition(async () => {
            const res = modal.category
                ? await updateCategory(modal.category._id, form)
                : await createCategory(form);

            if (res.success) {
                setModal({ open: false, category: null });
                router.refresh();
            } else {
                Swal.fire({ icon: "error", title: "Error", text: res.message });
            }
        });
    }

    async function handleDelete(cat) {
        const confirm = await Swal.fire({
            icon: "warning", title: "Delete Category?",
            text: `Entries using "${cat.name}" will retain a fallback label.`,
            showCancelButton: true, confirmButtonColor: "#ef4444", confirmButtonText: "Delete",
        });
        if (!confirm.isConfirmed) return;
        startTransition(async () => {
            const res = await deleteCategory(cat._id);
            if (res.success) router.refresh();
            else Swal.fire({ icon: "error", title: "Error", text: res.message });
        });
    }

    const grouped = TYPE_OPTIONS.reduce((acc, t) => {
        acc[t] = categories.filter((c) => c.type === t);
        return acc;
    }, {});

    const inputClass = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button onClick={openAdd} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                    <FaPlus size={12} /> Add Category
                </button>
            </div>

            {["expense", "income", "saving", "all"].map((type) => (
                <div key={type} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6">
                    <h2 className="text-base font-semibold capitalize text-gray-800 dark:text-white mb-4">{type} Categories</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {(grouped[type] || []).map((cat) => (
                            <div key={cat._id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: cat.color }}>
                                        {cat.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{cat.name}</p>
                                        {cat.isSystem && <p className="text-xs text-gray-400">System</p>}
                                    </div>
                                </div>
                                {!cat.isSystem && (
                                    <div className="flex gap-1">
                                        <button onClick={() => openEdit(cat)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors">
                                            <FaEdit size={12} />
                                        </button>
                                        <button onClick={() => handleDelete(cat)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500 transition-colors">
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {(grouped[type] || []).length === 0 && (
                            <p className="text-gray-400 text-sm col-span-3">No {type} categories yet.</p>
                        )}
                    </div>
                </div>
            ))}

            {/* Modal */}
            <Modal isOpen={modal.open} onClose={() => setModal({ open: false, category: null })} title={modal.category ? "Edit Category" : "Add Category"}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Category name" className={inputClass} />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputClass}>
                            {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon</label>
                        <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className={inputClass}>
                            {ICON_OPTIONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
                        <div className="flex items-center gap-3">
                            <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-12 h-10 rounded-lg cursor-pointer border border-gray-300" />
                            <span className="text-sm text-gray-500">{form.color}</span>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button onClick={() => setModal({ open: false, category: null })} className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} disabled={isPending} className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
                            {isPending ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
