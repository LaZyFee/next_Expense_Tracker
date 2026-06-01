"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTheme } from "next-themes";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryPieChart({ data = [] }) {
    if (!data.length) {
        return <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No expense data</div>;
    }

    const chartData = {
        labels: data.map((d) => d.category),
        datasets: [{
            data: data.map((d) => d.total),
            backgroundColor: data.map((d) => d.color || "#6366f1"),
            borderWidth: 2,
            borderColor: "transparent",
        }],
    };

    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    const textColor = isDark ? "#94a3b8" : "#475569";

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%",
        plugins: {
            legend: { 
                position: "bottom", 
                labels: { 
                    boxWidth: 12, 
                    padding: 12, 
                    font: { size: 11 },
                    color: textColor
                } 
            },
            tooltip: { callbacks: { label: (ctx) => ` ৳${ctx.raw.toLocaleString()} (${data[ctx.dataIndex]?.percentage}%)` } },
        },
    };

    return (
        <div className="h-64">
            <Doughnut data={chartData} options={options} />
        </div>
    );
}