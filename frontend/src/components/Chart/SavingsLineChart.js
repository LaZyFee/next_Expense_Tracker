"use client";

import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler,
} from "chart.js";
import { getMonthName } from "@/lib/utils";
import { useTheme } from "next-themes";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function SavingsLineChart({ data = [] }) {
    if (!data.length) {
        return <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data available</div>;
    }

    const labels = data.map((d) => getMonthName(d.month).slice(0, 3));
    const effectiveSavings = data.map((d) => d.effectiveSavings ?? d.saving);

    const chartData = {
        labels,
        datasets: [
            {
                label: "Effective Savings",
                data: effectiveSavings,
                borderColor: "#6366f1",
                backgroundColor: "rgba(99, 102, 241, 0.1)",
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "#6366f1",
                pointRadius: 4,
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
                    color: textColor
                } 
            },
            tooltip: { callbacks: { label: (ctx) => ` ৳${ctx.raw.toLocaleString()}` } },
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

    return (
        <div className="h-64">
            <Line data={chartData} options={options} />
        </div>
    );
}