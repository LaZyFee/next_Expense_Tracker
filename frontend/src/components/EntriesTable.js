"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import Swal from "sweetalert2";
import { formatCurrency, formatDate, TYPE_BG } from "@/lib/utils";
import { deleteEntry } from "@/actions/entryActions";
import Pagination from "@/components/shared/Pagination";
import ViewDetailsModal from "@/components/Modal/ViewDetailsModal";
import { FaEdit, FaTrash, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const columnHelper = createColumnHelper();

export default function EntriesTable({ initialEntries, initialPagination }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [entries, setEntries] = useState(initialEntries);
    const [pagination, setPagination] = useState({
        pageIndex: initialPagination.page - 1,
        pageSize: initialPagination.limit,
        totalPages: initialPagination.totalPages,
    });
    const [sorting, setSorting] = useState([{ id: "date", desc: true }]);
    const [selectedEntry, setSelectedEntry] = useState(null);

    useEffect(() => {
        setEntries(initialEntries);
        setPagination({
            pageIndex: initialPagination.page - 1,
            pageSize: initialPagination.limit,
            totalPages: initialPagination.totalPages,
        });
        setSelectedEntry(null);
    }, [initialEntries, initialPagination]);

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage);
        router.push(`/entries?${params.toString()}`);
    };

    const handleSort = (columnId) => {
        const current = sorting[0];
        let newSort = { id: columnId, desc: true };
        if (current && current.id === columnId) {
            newSort.desc = !current.desc;
        }
        setSorting([newSort]);
        const params = new URLSearchParams(searchParams.toString());
        params.set("sortBy", columnId);
        params.set("sortOrder", newSort.desc ? "desc" : "asc");
        params.set("page", "1");
        router.push(`/entries?${params.toString()}`);
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Delete transaction?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            confirmButtonText: "Delete",
        });
        if (!confirm.isConfirmed) return;

        startTransition(async () => {
            const res = await deleteEntry(id);
            if (res.success) {
                Swal.fire("Deleted!", "", "success");
                router.refresh();
            } else {
                Swal.fire("Error", res.message, "error");
            }
        });
    };

    const handleEdit = (entry) => {
        router.push(`/entries/add?id=${entry._id}`);
    };

    const columns = [
        columnHelper.accessor("date", {
            header: () => (
                <button onClick={() => handleSort("date")} className="flex items-center gap-1">
                    Date
                    {sorting[0]?.id === "date" ? (
                        sorting[0].desc ? <FaSortDown size={12} /> : <FaSortUp size={12} />
                    ) : (
                        <FaSort size={12} />
                    )}
                </button>
            ),
            cell: (info) => formatDate(info.getValue()),
        }),
        columnHelper.accessor("type", {
            header: "Type",
            cell: (info) => (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_BG[info.getValue()]}`}>
                    {info.getValue()}
                </span>
            ),
        }),
        columnHelper.accessor("category.name", {
            header: "Category",
            cell: (info) => info.getValue() || "Uncategorized",
        }),
        columnHelper.accessor("amount", {
            header: () => (
                <button onClick={() => handleSort("amount")} className="flex items-center gap-1">
                    Amount
                    {sorting[0]?.id === "amount" ? (
                        sorting[0].desc ? <FaSortDown size={12} /> : <FaSortUp size={12} />
                    ) : (
                        <FaSort size={12} />
                    )}
                </button>
            ),
            cell: (info) => {
                const entry = info.row.original;
                const prefix = entry.type === "expense" ? "-" : "+";
                const color =
                    entry.type === "income"
                        ? "text-green-600 dark:text-green-400"
                        : entry.type === "saving"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-red-500 dark:text-red-400";
                return <span className={`font-medium ${color}`}>{prefix}{formatCurrency(info.getValue())}</span>;
            },
        }),
        columnHelper.accessor("note", {
            header: "Note",
            cell: (info) => info.getValue()?.slice(0, 30) || "—",
        }),
        columnHelper.display({
            id: "actions",
            header: "Actions",
            cell: (info) => (
                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(info.row.original);
                        }}
                        className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                    >
                        <FaEdit size={14} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(info.row.original._id);
                        }}
                        className="p-1.5 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                    >
                        <FaTrash size={14} />
                    </button>
                </div>
            ),
        }),
    ];

    const table = useReactTable({
        data: entries,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
    });

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {entries.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-400">
                                    No transactions found. Add your first entry!
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition"
                                    onClick={() => {
                                        setSelectedEntry(row.original);
                                    }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pagination.totalPages > 1 && (
                <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
                    <Pagination
                        page={pagination.pageIndex + 1}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            <ViewDetailsModal
                entry={selectedEntry}
                onClose={() => setSelectedEntry(null)}
                onEdit={(entry) => handleEdit(entry)}
                onDelete={(id) => handleDelete(id)}
            />
        </div>
    );
}
