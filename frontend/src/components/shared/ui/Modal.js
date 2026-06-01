"use client";

import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

export default function Modal({ isOpen, onClose, title, children, size = "md" }) {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizes = {
        sm: "max-w-sm",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="absolute inset-0 bg-black/55 backdrop-blur-md" onClick={onClose} />
            <div className={`relative w-full ${sizes[size]} max-h-[calc(100vh-1.5rem)] overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl dark:bg-gray-900`}>
                {title && (
                    <div className="flex items-center justify-between border-b border-gray-200/80 bg-white/90 px-5 py-4 backdrop-blur dark:border-gray-700/80 dark:bg-gray-900/90 sm:px-6">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h2>
                        <button
                            onClick={onClose}
                            className="rounded-xl p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                        >
                            <FaTimes size={14} />
                        </button>
                    </div>
                )}
                <div className="modal-scrollbar-hide max-h-[calc(100vh-8rem)] overflow-y-auto px-5 py-5 sm:px-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
