"use client";

import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from "chart.js";
import { getMonthName } from "@/lib/utils";
import { useTheme } from "next-themes";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function MonthlyBarChart({ data = [] }) {
    const labels = data.map((d) => getMonthName(d.month).slice(0, 3));

    const chartData = {
        labels,
        datasets: [
            {
                label: "Income",
                data: data.map((d) => d.income),
                backgroundColor: "rgba(34, 197, 94, 0.8)",
                borderRadius: 6,
            },
            {
                label: "Expense",
                data: data.map((d) => d.expense),
                backgroundColor: "rgba(239, 68, 68, 0.8)",
                borderRadius: 6,
            },
            {
                label: "Saving",
                data: data.map((d) => d.saving),
                backgroundColor: "rgba(99, 102, 241, 0.8)",
                borderRadius: 6,
            },
        ],
    };

    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    const textColor = isDark ? "#94a3b8" : "#475569";
    const gridColor = isDark ? "rgba(51, 65, 85, 0.3)" : "rgba(226, 232, 240, 0.8)";

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { 
                position: "bottom", 
                labels: { 
                    boxWidth: 12, 
                    padding: 16,
                    color: textColor
                } 
            },
            tooltip: {
                callbacks: {
                    label: (ctx) => ` ৳${ctx.raw.toLocaleString()}`,
                },
            },
        },
        scales: {
            x: { 
                grid: { display: false },
                ticks: { color: textColor }
            },
            y: {
                beginAtZero: true,
                ticks: { 
                    callback: (v) => `৳${(v / 1000).toFixed(0)}k`,
                    color: textColor
                },
                grid: { color: gridColor }
            },
        },
    };

    if (!data.length) {
        return <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data available</div>;
    }

    return (
        <div className="h-64">
            <Bar data={chartData} options={options} />
        </div>
    );
}