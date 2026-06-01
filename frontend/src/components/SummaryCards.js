"use client";

import { FaArrowUp, FaArrowDown, FaPiggyBank, FaWallet } from "react-icons/fa";
import { formatCurrency } from "@/lib/utils";

export default function SummaryCards({ summary }) {
    const cards = [
        {
            label: "Total Income",
            value: summary?.totalIncome ?? 0,
            icon: FaArrowUp,
            color: "text-green-600 dark:text-green-400",
            bg: "bg-green-50 dark:bg-green-900/20",
            border: "border-green-200 dark:border-green-800",
        },
        {
            label: "Total Expense",
            value: summary?.totalExpense ?? 0,
            icon: FaArrowDown,
            color: "text-red-500 dark:text-red-400",
            bg: "bg-red-50 dark:bg-red-900/20",
            border: "border-red-200 dark:border-red-800",
        },
        {
            label: "Set Savings",
            value: summary?.totalSaving ?? 0,
            icon: FaPiggyBank,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            border: "border-blue-200 dark:border-blue-800",
        },
        {
            label: "Effective Savings",
            value: summary?.effectiveSavings ?? 0,
            icon: FaWallet,
            color: "text-indigo-600 dark:text-indigo-400",
            bg: "bg-indigo-50 dark:bg-indigo-900/20",
            border: "border-indigo-200 dark:border-indigo-800",
            tooltip: "Set savings + leftover income after expenses",
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map(({ label, value, icon: Icon, color, bg, border, tooltip }) => (
                <div key={label} className={`bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5 border ${border}`}>
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
                        <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                            <Icon className={color} size={14} />
                        </div>
                    </div>
                    <p className={`text-xl font-bold ${color}`}>{formatCurrency(value)}</p>
                    {tooltip && <p className="text-xs text-gray-400 mt-1">{tooltip}</p>}
                </div>
            ))}
        </div>
    );
}