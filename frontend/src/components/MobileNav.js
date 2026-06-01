"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaList, FaChartPie, FaTags, FaWallet } from "react-icons/fa";

const navItems = [
    { label: "Home", href: "/dashboard", icon: FaHome },
    { label: "Entries", href: "/entries", icon: FaList },
    { label: "Reports", href: "/reports", icon: FaChartPie },
    { label: "Budgets", href: "/budgets", icon: FaWallet },
    { label: "Tags", href: "/categories", icon: FaTags },
];

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40">
            <div className="flex">
                {navItems.map(({ label, href, icon: Icon }) => {
                    const active = pathname === href || pathname.startsWith(href + "/");
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${active
                                    ? "text-indigo-600 dark:text-indigo-400"
                                    : "text-gray-500 dark:text-gray-400"
                                }`}
                        >
                            <Icon size={18} />
                            {label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}