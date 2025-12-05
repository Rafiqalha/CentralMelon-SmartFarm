'use client';

import { useState, useEffect } from 'react';
import {
    Filter, Grid, List, Download, ChevronDown, CheckCircle,
    TrendingUp, Calendar, Package, ArrowRight, Activity, Droplets, ShoppingCart
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client'; 
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Product = {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    grade: string;
    image_url: string;
    brix: string;      
    moq: string;        
    description: string;
};

export default function EnterpriseCatalog() {
    const router = useRouter();
    const { addToCart } = useCart();
    const supabase = createClient(); 

    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('All');

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('id', { ascending: true });

            if (data) {
                setProducts(data);
            }
            setLoading(false);
        };

        fetchData();

        const channel = supabase
            .channel('public-catalog')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
                fetchData();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const filteredProducts = products.filter(p => {
        return (filterCategory === 'All' || p.category === filterCategory);
    });

    const handleRequestQuote = (product: Product) => {
        if (product.stock <= 0) return;
        addToCart(product);
        router.push('/checkout');
    };

    const getHarvestDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 3); // Panen 3 hari lagi
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    };

    return (
        <section className="bg-[#f8f9fa] min-h-screen font-sans text-slate-800">
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

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Varietas', value: `${products.length} Jenis`, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { label: 'Stok Siap Kirim', value: `${products.reduce((acc, curr) => acc + curr.stock, 0)} Unit`, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { label: 'Forecast Mingguan', value: '+200 Unit', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
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

            <div className="sticky top-20 z-30 bg-[#f8f9fa]/95 backdrop-blur border-b border-gray-200 py-4">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-4 items-center">
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
                    </div>

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

            <div className="max-w-7xl mx-auto px-6 py-8">
                {loading ? (
                    <div className="text-center py-20 text-gray-400 animate-pulse">Memuat data greenhouse...</div>
                ) : viewMode === 'grid' ? (

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map(p => (
                            <div key={p.id} className={`group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col ${p.stock <= 0 ? 'opacity-75 grayscale' : ''}`}>
                                <div className="relative h-64 bg-gray-100 overflow-hidden flex items-center justify-center">
                                    {p.image_url ? (
                                        <Image src={p.image_url} alt={p.name} fill className="object-cover group-hover:scale-105 transition duration-700" />
                                    ) : (
                                        <div className="text-gray-300">No Image</div>
                                    )}
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className="bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1 rounded-md shadow-sm border border-gray-100">
                                            {p.grade} Premium
                                        </span>
                                        {p.stock > 0 ? (
                                            <span className={`text-white text-xs font-bold px-3 py-1 rounded-md shadow-sm ${p.stock < 10 ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                                                {p.stock < 10 ? `Sisa ${p.stock}` : 'Ready Stock'}
                                            </span>
                                        ) : (
                                            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-md shadow-sm">
                                                Sold Out
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-slate-900">{p.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{p.category}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm border-t border-b border-gray-100 py-4 mb-6">
                                        <div>
                                            <p className="text-gray-400 text-xs uppercase font-bold">Avg Brix</p>
                                            <p className="font-semibold text-slate-800 flex items-center gap-1">
                                                <Droplets size={12} className="text-emerald-500" /> {p.brix || '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-xs uppercase font-bold">Stok Gudang</p>
                                            <p className={`font-bold ${p.stock > 0 ? 'text-slate-800' : 'text-red-500'}`}>{p.stock} Unit</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-xs uppercase font-bold">MOQ</p>
                                            <p className="font-semibold text-slate-800">{p.moq || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-xs uppercase font-bold">Harvest ETA</p>
                                            <p className="font-semibold text-orange-600">{getHarvestDate()}</p>
                                        </div>
                                    </div>

                                    {/* Pricing & CTA */}
                                    <div className="mt-auto flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-400">Harga / Unit</p>
                                            <p className="text-lg font-bold text-slate-900">Rp {p.price.toLocaleString()}</p>
                                        </div>
                                        <button
                                            onClick={() => handleRequestQuote(p)}
                                            disabled={p.stock <= 0}
                                            className={`px-5 py-2.5 text-white font-bold rounded-lg transition shadow-lg flex items-center gap-2 ${p.stock > 0
                                                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'
                                                    : 'bg-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            {p.stock > 0 ? <><ShoppingCart size={16} /> + Keranjang</> : 'Habis'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                ) : (
                    
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 font-bold uppercase border-b border-gray-200">
                                <tr>
                                    <th className="p-4">Varietas</th>
                                    <th className="p-4">Grade</th>
                                    <th className="p-4">Brix</th>
                                    <th className="p-4">Stock</th>
                                    <th className="p-4">Harga</th>
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
                                        <td className="p-4 text-slate-600">{p.brix}</td>
                                        <td className={`p-4 font-bold ${p.stock < 10 ? 'text-amber-600' : 'text-emerald-600'}`}>{p.stock}</td>
                                        <td className="p-4 font-mono">Rp {p.price.toLocaleString()}</td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleRequestQuote(p)}
                                                disabled={p.stock <= 0}
                                                className={`font-bold hover:underline ${p.stock > 0 ? 'text-emerald-600' : 'text-gray-400'}`}
                                            >
                                                {p.stock > 0 ? 'Add to Cart' : 'Sold Out'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </section>
    );
}