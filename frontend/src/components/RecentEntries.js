import { formatCurrency, formatDate, TYPE_BG } from "@/lib/utils";

export default function RecentEntries({ entries = [] }) {
    if (!entries.length) {
        return <p className="text-gray-400 text-sm text-center py-8">No entries yet. Add your first entry!</p>;
    }

    return (
        <div className="space-y-3">
            {entries.map((entry) => (
                <div key={entry._id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                            style={{ backgroundColor: entry.category?.color || "#6366f1" }}
                        >
                            {entry.category?.name?.[0] || "?"}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                {entry.category?.name || "Uncategorized"}
                            </p>
                            <p className="text-xs text-gray-400">{formatDate(entry.date)}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className={`text-sm font-semibold ${entry.type === "income" ? "text-green-600 dark:text-green-400"
                                : entry.type === "saving" ? "text-blue-600 dark:text-blue-400"
                                    : "text-red-500 dark:text-red-400"
                            }`}>
                            {entry.type === "expense" ? "-" : "+"}{formatCurrency(entry.amount)}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_BG[entry.type]}`}>
                            {entry.type}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}