"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getMonthName } from "@/lib/utils";

export default function MonthYearPicker({ month, year }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function navigate(newMonth, newYear) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("month", newMonth);
        params.set("year", newYear);
        params.delete("page");
        router.push(`${pathname}?${params.toString()}`);
    }

    function prev() {
        if (month === 1) navigate(12, year - 1);
        else navigate(month - 1, year);
    }

    function next() {
        if (month === 12) navigate(1, year + 1);
        else navigate(month + 1, year);
    }

    return (
        <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2">
            <button onClick={prev} className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <FaChevronLeft size={12} />
            </button>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-30 text-center">
                {getMonthName(month)} {year}
            </span>
            <button onClick={next} className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <FaChevronRight size={12} />
            </button>
        </div>
    );
}