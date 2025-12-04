'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FileText, Calendar, DollarSign, Package } from 'lucide-react';

export default function SalesReport() {
    const supabase = createClient();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            // Join tabel transactions dengan transaction_items (jika perlu detail)
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) setTransactions(data);
            setLoading(false);
        };
        fetchTransactions();
    }, []);

    // Hitung Ringkasan
    const totalRevenue = transactions.reduce((acc, curr) => acc + curr.total_amount, 0);
    const totalTrx = transactions.length;

    return (
        <div className="space-y-6">
            {/* Header Ringkasan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-sm font-medium">Total Omset</p>
                        <h3 className="text-3xl font-bold text-emerald-400 mt-1">Rp {totalRevenue.toLocaleString()}</h3>
                    </div>
                    <div className="p-4 bg-white/10 rounded-2xl">
                        <DollarSign size={32} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Total Transaksi</p>
                        <h3 className="text-3xl font-bold text-slate-800 mt-1">{totalTrx}</h3>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-2xl text-slate-600">
                        <FileText size={32} />
                    </div>
                </div>
            </div>

            {/* Tabel Laporan */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-slate-800">Riwayat Transaksi</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                            <tr>
                                <th className="p-4">ID Transaksi</th>
                                <th className="p-4">Tanggal</th>
                                <th className="p-4">Metode</th>
                                <th className="p-4 text-right">Total Bayar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={4} className="p-8 text-center">Memuat data...</td></tr>
                            ) : transactions.map((trx) => (
                                <tr key={trx.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 font-mono text-xs text-slate-500">{trx.id}</td>
                                    <td className="p-4 text-slate-700 text-sm">
                                        {new Date(trx.created_at).toLocaleString('id-ID')}
                                    </td>
                                    <td className="p-4">
                                        <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">
                                            {trx.payment_method}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-bold text-slate-900">
                                        Rp {trx.total_amount.toLocaleString()}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}