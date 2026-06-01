"use client";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Pagination({ page, totalPages, onPageChange }) {
    const pages = [];
    const delta = 1;
    const left = page - delta;
    const right = page + delta;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= left && i <= right)) {
            pages.push(i);
        } else if (i === left - 1 || i === right + 1) {
            pages.push("...");
        }
    }

    // Remove duplicate "..."
    const dedupedPages = pages.filter((p, i) => !(p === "..." && pages[i - 1] === "..."));

    return (
        <div className="flex items-center justify-center gap-1 pt-4">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
                <FaChevronLeft size={12} />
            </button>

            {dedupedPages.map((p, i) =>
                p === "..." ? (
                    <span key={`dots-${i}`} className="px-2 text-gray-400">…</span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === page
                            ? "bg-indigo-600 text-white"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                            }`}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
                <FaChevronRight size={12} />
            </button>
        </div>
    );
}