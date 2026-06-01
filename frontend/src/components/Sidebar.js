"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FaHome, FaList, FaChartPie, FaTags, FaWallet, FaSignOutAlt,
    FaUserCircle,
} from "react-icons/fa";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: FaHome },
    { label: "Entries", href: "/entries", icon: FaList },
    { label: "Reports", href: "/reports", icon: FaChartPie },
    { label: "Budgets", href: "/budgets", icon: FaWallet },
    { label: "Categories", href: "/categories", icon: FaTags },
    { label: "Profile", href: "/profile", icon: FaUserCircle },
];

export default function Sidebar() {
    const pathname = usePathname();

    const handleLogout = () => {
        document.cookie = "token=; path=/; max-age=0";
        window.location.href = "/login";
    };

    return (
        <aside className="hidden md:flex w-60 flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-screen sticky top-0">
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map(({ label, href, icon: Icon }) => {
                    const active = pathname === href || pathname.startsWith(href + "/");
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${active
                                ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                                }`}
                        >
                            <Icon size={16} />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                    <FaSignOutAlt size={16} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
