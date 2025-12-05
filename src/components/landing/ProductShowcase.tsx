'use client';
import { useState, useEffect } from 'react';
import { Star, Package, Info, TrendingUp, Image as ImageIcon, ShoppingCart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

const categories = ["All", "Net Melon", "Smooth Skin", "Exotic"];

export default function ProductShowcase() {
    const [filter, setFilter] = useState("All");
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { addToCart } = useCart();

    const handleOrder = (product: any) => {
        addToCart(product); 
        router.push('/checkout');
    };

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await supabase.from('products').select('*').order('id', { ascending: true });
            if (data) setProducts(data);
            setLoading(false);
        };

        fetchProducts();

        const channel = supabase
            .channel('products_realtime')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'products' }, (payload) => {
                setProducts((current) =>
                    current.map((p) => (p.id === payload.new.id ? { ...p, ...payload.new } : p))
                );
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const filteredProducts = filter === "All"
        ? products
        : products.filter(p => p.category === filter);

    const getStatusBadge = (stock: number) => {
        if (stock === 0) return { text: 'Out of Stock', color: 'bg-red-500/90' };
        if (stock < 10) return { text: `Limited: Sisa ${stock}`, color: 'bg-amber-500/90' };
        return { text: 'Ready Stock', color: 'bg-emerald-500/90' };
    };

    return (
        <div id="products" className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-200 pb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-3">
                            <Package size={14} /> Wholesale Catalog
                        </div>
                        <h2 className="text-4xl font-bold text-slate-900">Komoditas Melon Premium</h2>
                        <p className="text-gray-500 mt-2 max-w-xl">
                            Suplai langsung dari Smart Greenhouse. Stok terupdate secara <strong>Real-Time</strong>.
                        </p>
                    </div>

                    <div className="flex gap-2 mt-6 md:mt-0 overflow-x-auto pb-2 md:pb-0">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap ${filter === cat
                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                                    : "bg-white text-gray-500 border border-gray-200 hover:border-emerald-500 hover:text-emerald-600"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* LOADING STATE */}
                {loading && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 animate-pulse">Memuat data stok terbaru...</p>
                    </div>
                )}

                {/* GRID PRODUK */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {!loading && filteredProducts.map((p) => {
                        const status = getStatusBadge(p.stock);

                        return (
                            <div key={p.id} className={`group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition duration-500 border border-gray-100 flex flex-col h-full ${p.stock === 0 ? 'opacity-70 grayscale-[0.5]' : ''}`}>

                                {/* IMAGE AREA */}
                                <div className="h-64 overflow-hidden relative bg-gray-100 flex items-center justify-center">
                                    {p.image_url ? (
                                        <img
                                            src={p.image_url}
                                            alt={p.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-300">
                                            <ImageIcon size={64} strokeWidth={1} />
                                            <span className="text-xs font-medium mt-2">No Image Available</span>
                                        </div>
                                    )}

                                    {/* Badge Status */}
                                    <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md shadow-sm text-white ${status.color}`}>
                                        {status.text}
                                    </div>

                                    {/* Badge Grade */}
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-1 shadow-sm">
                                        <Star size={12} className="text-yellow-500" fill="currentColor" /> {p.grade}
                                    </div>
                                </div>

                                {/* CONTENT AREA */}
                                <div className="p-7 flex flex-col grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">{p.category}</p>
                                            <h3 className="text-xl font-bold text-slate-900 leading-tight">{p.name}</h3>
                                        </div>
                                    </div>

                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 border-b border-gray-100 pb-4 line-clamp-2">
                                        {p.description}
                                    </p>

                                    {/* SPESIFIKASI */}
                                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm mb-6 bg-slate-50 p-4 rounded-xl">
                                        <div>
                                            <p className="text-gray-400 text-xs mb-0.5">Price / Kg</p>
                                            <p className="font-bold text-slate-800">Rp {p.price?.toLocaleString('id-ID')}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-xs mb-0.5">MOQ</p>
                                            <p className="font-bold text-slate-800 flex items-center gap-1">
                                                <Package size={14} className="text-blue-500" /> {p.moq}
                                            </p>
                                        </div>
                                    </div>

                                    {/* CTA BUTTON */}
                                    <div className="mt-auto">
                                        {p.stock > 0 ? (
                                            <button
                                                onClick={() => handleOrder(p)} 
                                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-emerald-600 transition shadow-lg shadow-slate-200"
                                            >
                                                <ShoppingCart size={18} />
                                                + Keranjang
                                            </button>
                                        ) : (
                                            <button disabled className="w-full block text-center py-3 rounded-xl bg-gray-200 text-gray-400 font-bold cursor-not-allowed">
                                                Stok Habis
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}