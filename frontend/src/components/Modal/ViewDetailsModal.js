"use client";

import { formatCurrency, formatDate, TYPE_BG } from "@/lib/utils";
import { FaCalendarAlt, FaStickyNote, FaEdit, FaTrash } from "react-icons/fa";
import Modal from "../shared/ui/Modal";

export default function ViewDetailsModal({ entry, onClose, onEdit, onDelete }) {
    if (!entry) return null;

    return (
        <Modal isOpen={!!entry} onClose={onClose} title="Entry Details">
            <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0"
                        style={{ backgroundColor: entry.category?.color || "#6366f1" }}
                    >
                        {entry.category?.name?.[0] || "?"}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-lg">
                            {entry.category?.name || "Uncategorized"}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${TYPE_BG[entry.type]}`}>
                            {entry.type}
                        </span>
                    </div>
                </div>

                {/* Amount */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Amount</p>
                    <p className={`text-3xl font-bold ${entry.type === "income" ? "text-green-600 dark:text-green-400"
                        : entry.type === "saving" ? "text-blue-600 dark:text-blue-400"
                            : "text-red-500 dark:text-red-400"
                        }`}>
                        {entry.type === "expense" ? "-" : "+"}{formatCurrency(entry.amount)}
                    </p>
                </div>

                {/* Details */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                        <FaCalendarAlt className="text-gray-400 shrink-0" size={14} />
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Date</p>
                            <p className="text-gray-800 dark:text-gray-200 font-medium">{formatDate(entry.date)}</p>
                        </div>
                    </div>

                    {entry.note && (
                        <div className="flex items-start gap-3 text-sm">
                            <FaStickyNote className="text-gray-400 shrink-0 mt-0.5" size={14} />
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wide">Note</p>
                                <p className="text-gray-800 dark:text-gray-200">{entry.note}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Timestamps */}
                <div className="text-xs text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-3 space-y-1">
                    <p>Created: {formatDate(entry.createdAt)}</p>
                    <p>Updated: {formatDate(entry.updatedAt)}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={() => { onClose(); onEdit(entry); }}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 py-2.5 rounded-xl text-sm font-medium transition-colors"
                    >
                        <FaEdit size={12} /> Edit
                    </button>
                    <button
                        onClick={() => { onClose(); onDelete(entry._id); }}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 py-2.5 rounded-xl text-sm font-medium transition-colors"
                    >
                        <FaTrash size={12} /> Delete
                    </button>
                </div>
            </div>
        </Modal>
    );
}