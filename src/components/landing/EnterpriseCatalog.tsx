'use client';

import { useState, useEffect } from 'react';
import {
    Filter, Grid, List, Download, ChevronDown, CheckCircle,
    TrendingUp, Calendar, Package, ArrowRight, Activity, Droplets
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client'; // Pastikan path benar
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Tipe Data Produk Enterprise
type Product = {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    grade: string;
    image_url: string;
    brix: number; // Kemanisan
    weight_class: string; // Misal: 1.2 - 1.5 kg
    harvest_date: string; // Tanggal Panen
    moq: string;
};

export default function EnterpriseCatalog() {
    const supabase = createClient();
    const router = useRouter();
    const { addToCart } = useCart();
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter State
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterBrix, setFilterBrix] = useState('All');

    // 1. Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            // Simulasi data tambahan (Brix, Weight) jika belum ada di DB
            // Idealnya kolom ini ada di tabel 'products'
            const { data } = await supabase.from('products').select('*');
            if (data) {
                const enrichedData = data.map(p => ({
                    ...p,
                    brix: p.sweetness ? parseFloat(p.sweetness) : 14.5, // Fallback dummy
                    weight_class: '1.2 - 1.6 kg',
                    harvest_date: new Date(Date.now() + 86400000 * 3).toISOString() // 3 hari lagi
                }));
                setProducts(enrichedData);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    // 2. Filter Logic
    const filteredProducts = products.filter(p => {
        return (filterCategory === 'All' || p.category === filterCategory);
        // Tambahkan logic filter brix di sini nanti
    });

    // Handler Checkout B2B
    const handleRequestQuote = (product: Product) => {
        addToCart(product);
        router.push('/checkout');
    };

    return (
        <section className="bg-[#f8f9fa] min-h-screen font-sans text-slate-800">

            {/* --- HERO SECTION B2B --- */}
            <div className="bg-white border-b border-gray-200 pt-32 pb-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8">
                        <div>
                            <span className="text-emerald-700 font-bold tracking-widest text-xs uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                Enterprise Procurement Portal
                            </span>
                            <h1 className="text-4xl font-bold mt-4 text-slate-900">Katalog Melon Premium</h1>
                            <p className="text-slate-500 mt-2 max-w-2xl text-lg">
                                Suplai langsung dari Smart Greenhouse dengan standar kualitas ekspor. Data real-time untuk keputusan pengadaan yang presisi.
                            </p>
                        </div>
                        <div className="flex gap-3 mt-6 md:mt-0">
                            <button className="px-5 py-2.5 bg-slate-900 text-white font-medium rounded-lg text-sm flex items-center gap-2 hover:bg-slate-800 transition">
                                <Download size={16} /> Download Price List (PDF)
                            </button>
                        </div>
                    </div>

                    {/* Statistik Kapasitas (Hero Metrics) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Varietas', value: '12 Jenis', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { label: 'Stok Siap Kirim', value: '8.5 Ton', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { label: 'Forecast Mingguan', value: '+2.1 Ton', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
                            { label: 'Konsistensi Brix', value: '94% Stabil', icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50' },
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm flex items-center gap-4">
                                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">{stat.label}</p>
                                    <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- CONTROL BAR & FILTERS --- */}
            <div className="sticky top-20 z-30 bg-[#f8f9fa]/95 backdrop-blur border-b border-gray-200 py-4">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-4 items-center">

                    {/* Advanced Filters */}
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                        {['All', 'Net Melon', 'Smooth Skin', 'Exotic'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition border ${filterCategory === cat
                                    ? 'bg-slate-900 text-white border-slate-900'
                                    : 'bg-white text-slate-600 border-gray-200 hover:border-slate-300'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                        <div className="h-8 w-px bg-gray-300 mx-2"></div>

                        {/* Dropdown Filter Teknis */}
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-slate-600 hover:border-emerald-500 hover:text-emerald-600">
                            <Filter size={14} /> Brix Range <ChevronDown size={14} />
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-slate-600 hover:border-emerald-500 hover:text-emerald-600">
                            <Calendar size={14} /> Harvest Cycle <ChevronDown size={14} />
                        </button>
                    </div>

                    {/* View Switcher */}
                    <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-md transition ${viewMode === 'table' ? 'bg-slate-100 text-slate-900' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* --- PRODUCT CONTENT --- */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Memuat data greenhouse...</div>
                ) : viewMode === 'grid' ? (

                    /* MODE GRID: TECHNICAL CARDS */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map(p => (
                            <div key={p.id} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col">
                                {/* Header Image & Badge */}
                                <div className="relative h-64 bg-gray-100 overflow-hidden">
                                    {p.image_url ? (
                                        <Image src={p.image_url} alt={p.name} fill className="object-cover group-hover:scale-105 transition duration-700" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-300">No Image</div>
                                    )}
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className="bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1 rounded-md shadow-sm border border-gray-100">
                                            {p.grade} Premium
                                        </span>
                                        {p.stock > 0 ? (
                                            <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-md shadow-sm">
                                                Ready Stock
                                            </span>
                                        ) : (
                                            <span className="bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-md shadow-sm">
                                                Sold Out
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Technical Data Body */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-slate-900">{p.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{p.category} Series</p>
                                    </div>

                                    {/* Data Grid Kecil */}
                                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm border-t border-b border-gray-100 py-4 mb-6">
                                        <div>
                                            <p className="text-gray-400 text-xs uppercase font-bold">Avg Brix</p>
                                            <p className="font-semibold text-slate-800 flex items-center gap-1">
                                                <Droplets size={12} className="text-emerald-500" /> {p.brix}%
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-xs uppercase font-bold">Weight Class</p>
                                            <p className="font-semibold text-slate-800">{p.weight_class}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-xs uppercase font-bold">MOQ</p>
                                            <p className="font-semibold text-slate-800">{p.moq}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-xs uppercase font-bold">Harvest ETA</p>
                                            <p className="font-semibold text-orange-600">
                                                {new Date(p.harvest_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Pricing & CTA */}
                                    <div className="mt-auto flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-400">Harga Estimasi</p>
                                            <p className="text-lg font-bold text-slate-900">Rp {p.price.toLocaleString()}<span className="text-sm font-normal text-gray-500">/kg</span></p>
                                        </div>
                                        <button
                                            onClick={() => handleRequestQuote(p)}
                                            className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-100 flex items-center gap-2"
                                        >
                                            Request Quote <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                ) : (
                    /* MODE TABLE: BULK VIEW */
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 font-bold uppercase border-b border-gray-200">
                                <tr>
                                    <th className="p-4">Varietas</th>
                                    <th className="p-4">Grade</th>
                                    <th className="p-4">Brix</th>
                                    <th className="p-4">Weight</th>
                                    <th className="p-4">Harvest ETA</th>
                                    <th className="p-4">Stock</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProducts.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition">
                                        <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden relative">
                                                {p.image_url && <Image src={p.image_url} alt="" fill className="object-cover" />}
                                            </div>
                                            {p.name}
                                        </td>
                                        <td className="p-4"><span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">{p.grade}</span></td>
                                        <td className="p-4 text-slate-600">{p.brix}%</td>
                                        <td className="p-4 text-slate-600">{p.weight_class}</td>
                                        <td className="p-4 text-orange-600 font-medium">
                                            {new Date(p.harvest_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                        </td>
                                        <td className="p-4 font-bold">{p.stock} Kg</td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleRequestQuote(p)}
                                                className="text-emerald-600 font-bold hover:underline"
                                            >
                                                Add to RFQ
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* --- TRUST & CAPABILITY SECTION --- */}
            <div className="bg-white border-t border-gray-200 py-16 mt-12">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">Trusted by Premium Partners</h2>
                    <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Logo Dummy Partner */}
                        <div className="h-12 w-32 bg-gray-200 rounded flex items-center justify-center font-bold text-gray-400">HOTEL A</div>
                        <div className="h-12 w-32 bg-gray-200 rounded flex items-center justify-center font-bold text-gray-400">SUPERMARKET B</div>
                        <div className="h-12 w-32 bg-gray-200 rounded flex items-center justify-center font-bold text-gray-400">EXPORTER C</div>
                        <div className="h-12 w-32 bg-gray-200 rounded flex items-center justify-center font-bold text-gray-400">RESTO D</div>
                    </div>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">Global GAP Certified</h3>
                            <p className="text-sm text-gray-500">Seluruh proses budidaya memenuhi standar keamanan pangan internasional.</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">Cold Chain Logistics</h3>
                            <p className="text-sm text-gray-500">Pengiriman suhu terkontrol 5-10°C untuk menjaga kesegaran hingga tujuan.</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">Sustainable Farming</h3>
                            <p className="text-sm text-gray-500">Penggunaan air 40% lebih efisien dengan sistem irigasi tetes pintar.</p>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
}