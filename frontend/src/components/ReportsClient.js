"use client";

import { useState } from "react";
import MonthlyBarChart from "./Chart/MonthlyBarChart";
import CategoryPieChart from "./Chart/CategoryPieChart";
import SavingsLineChart from "./Chart/SavingsLineChart";
import { formatCurrency } from "@/lib/utils";

const TABS = ["Overview", "By Category", "Savings Trend"];

export default function ReportsClient({ trend = [], categoryBreakdown = [], summary, month, year }) {
    const [activeTab, setActiveTab] = useState("Overview");

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab
                                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === "Overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6">
                        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">Monthly Trend ({year})</h3>
                        <MonthlyBarChart data={trend} />
                    </div>
                    {summary && (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 space-y-4">
                            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Monthly Summary</h3>
                            {[
                                { label: "Total Income", value: summary.totalIncome, color: "text-green-600 dark:text-green-400" },
                                { label: "Set Savings", value: summary.totalSaving, color: "text-blue-600 dark:text-blue-400" },
                                { label: "Remaining (after savings)", value: summary.remainingAfterSaving, color: "text-gray-600 dark:text-gray-400" },
                                { label: "Total Expense", value: summary.totalExpense, color: "text-red-500 dark:text-red-400" },
                                { label: "Surplus / Deficit", value: summary.remainingAfterExpense, color: summary.remainingAfterExpense >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400" },
                                { label: "Effective Savings (carry-over)", value: summary.effectiveSavings, color: "text-indigo-600 dark:text-indigo-400", bold: true },
                            ].map(({ label, value, color, bold }) => (
                                <div key={label} className={`flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800 last:border-0 ${bold ? "font-semibold" : ""}`}>
                                    <span className={`text-sm ${bold ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>{label}</span>
                                    <span className={`text-sm font-medium ${color}`}>{formatCurrency(value)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === "By Category" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6">
                        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">Expense Breakdown</h3>
                        <CategoryPieChart data={categoryBreakdown} />
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6">
                        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">By Category</h3>
                        <div className="space-y-3">
                            {categoryBreakdown.map((item) => (
                                <div key={item.category} className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <div className="flex-1">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-700 dark:text-gray-300">{item.category}</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(item.total)}</span>
                                        </div>
                                        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                                            <div className="h-full rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: item.color }} />
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400 w-10 text-right">{item.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "Savings Trend" && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">Savings Growth ({year})</h3>
                    <SavingsLineChart data={trend} />
                </div>
            )}
        </div>
    );
}