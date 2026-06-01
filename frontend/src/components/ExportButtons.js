'use client';
import { useState } from 'react';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function ExportButtons({ filters }) {
    const [loading, setLoading] = useState({ excel: false, pdf: false });

    const download = async (format) => {
        setLoading(prev => ({ ...prev, [format]: true }));
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        const query = new URLSearchParams(filters).toString();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/export/${format}?${query}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Export failed');
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `transactions_${Date.now()}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Export Error', text: err.message });
        } finally {
            setLoading(prev => ({ ...prev, [format]: false }));
        }
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={() => download('excel')}
                disabled={loading.excel}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 disabled:opacity-50"
            >
                <FaFileExcel /> {loading.excel ? '...' : 'Excel'}
            </button>
            <button
                onClick={() => download('pdf')}
                disabled={loading.pdf}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 disabled:opacity-50"
            >
                <FaFilePdf /> {loading.pdf ? '...' : 'PDF'}
            </button>
        </div>
    );
}