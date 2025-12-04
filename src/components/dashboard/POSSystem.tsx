'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, Plus, Minus, Trash2, ShoppingCart, Banknote, ShoppingBasket, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast'; 
import ConfirmationModal from '@/components/ui/ConfirmationModal';

export default function POSSystem() {
    const supabase = createClient();
    const [products, setProducts] = useState<any[]>([]);
    const [cart, setCart] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

    // 1. Fetch Produk
    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await supabase.from('products').select('*').order('name');
            if (data) setProducts(data);
        };
        fetchProducts();
    }, []);

    // 2. Logic Cart
    const addToCart = (product: any) => {
        const existing = cart.find(c => c.id === product.id);
        if (existing) {
            setCart(cart.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c));
        } else {
            setCart([...cart, { ...product, qty: 1 }]);
        }
    };

    const updateQty = (id: number, delta: number) => {
        setCart(cart.map(c => {
            if (c.id === id) return { ...c, qty: Math.max(1, c.qty + delta) };
            return c;
        }));
    };

    const removeItem = (id: number) => {
        setCart(cart.filter(c => c.id !== id));
    };

    const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    // 3. Proses Transaksi (Fungsi yang hilang tadi)
    const executeCheckout = async () => {
        setProcessing(true);
        try {
            // A. Simpan Transaksi Header
            const { data: trans, error: transError } = await supabase
                .from('transactions')
                .insert([{ total_amount: totalAmount, payment_method: 'CASH' }])
                .select()
                .single();

            if (transError) throw transError;

            // B. Simpan Detail Item
            const itemsData = cart.map(item => ({
                transaction_id: trans.id,
                product_id: item.id,
                product_name: item.name,
                quantity: item.qty,
                price_at_transaction: item.price,
                subtotal: item.price * item.qty
            }));

            const { error: itemsError } = await supabase.from('transaction_items').insert(itemsData);
            if (itemsError) throw itemsError;

            // C. Kurangi Stok Produk
            for (const item of cart) {
                const currentProduct = products.find(p => p.id === item.id);
                if (currentProduct) {
                    await supabase.from('products')
                        .update({ stock: currentProduct.stock - item.qty })
                        .eq('id', item.id);
                }
            }

            // SUKSES!
            toast.success("Transaksi Berhasil Disimpan!", { duration: 4000 });
            setCart([]); // Reset Cart
            setIsCheckoutModalOpen(false); // Tutup Modal

            // Refresh Data Produk
            const { data } = await supabase.from('products').select('*').order('name');
            if (data) setProducts(data);

        } catch (error: any) {
            toast.error("Gagal: " + error.message);
        } finally {
            setProcessing(false);
        }
    };

    // Filter Produk
    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <>
            {/* MODAL KONFIRMASI */}
            <ConfirmationModal
                isOpen={isCheckoutModalOpen}
                title="Konfirmasi Pembayaran"
                message={`Anda akan memproses pembayaran tunai senilai Rp ${totalAmount.toLocaleString('id-ID')}. Lanjutkan?`}
                confirmText="Bayar Sekarang"
                type="success"
                isLoading={processing}
                onConfirm={executeCheckout}
                onCancel={() => setIsCheckoutModalOpen(false)}
            />

            <div className="flex flex-col lg:flex-row gap-6 h-[85vh]">

                {/* --- BAGIAN KIRI: KATALOG PRODUK --- */}
                <div className="flex-1 flex flex-col bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Header Pencarian */}
                    <div className="p-6 border-b border-gray-100 flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Cari nama produk atau scan barcode..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Tabel Produk */}
                    <div className="flex-1 overflow-y-auto p-0">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 sticky top-0 z-10 text-xs font-bold text-gray-500 uppercase">
                                <tr>
                                    <th className="p-4">Produk</th>
                                    <th className="p-4">Harga</th>
                                    <th className="p-4 text-center">Stok</th>
                                    <th className="p-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProducts.map((p) => (
                                    <tr key={p.id} className="hover:bg-emerald-50/50 transition group">
                                        <td className="p-4 font-medium text-slate-800">{p.name}</td>
                                        <td className="p-4 text-slate-600">Rp {p.price.toLocaleString()}</td>
                                        <td className={`p-4 text-center font-bold ${p.stock < 10 ? 'text-red-500' : 'text-emerald-600'}`}>
                                            {p.stock}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => addToCart(p)}
                                                disabled={p.stock <= 0}
                                                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                + Tambah
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- BAGIAN KANAN: KERANJANG KASIR --- */}
                <div className="w-full lg:w-96 bg-[#1e293b] text-white rounded-3xl shadow-xl flex flex-col border border-slate-700">
                    <div className="p-6 border-b border-slate-700">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <ShoppingCart className="text-emerald-400" /> Keranjang Belanja
                        </h2>
                        <p className="text-slate-400 text-xs mt-1">Transaksi Offline / Walk-in</p>
                    </div>

                    {/* List Item Keranjang */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                                <ShoppingBasket size={48} className="mb-2" />
                                <p>Belum ada item</p>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div key={item.id} className="bg-slate-800 p-3 rounded-xl flex justify-between items-center animate-in slide-in-from-right-2">
                                    <div>
                                        <p className="font-bold text-sm text-white">{item.name}</p>
                                        <p className="text-xs text-emerald-400">Rp {item.price.toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center bg-slate-700 rounded-lg">
                                            <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:text-red-400 px-2">-</button>
                                            <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                                            <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:text-emerald-400 px-2">+</button>
                                        </div>
                                        <button onClick={() => removeItem(item.id)} className="text-slate-500 hover:text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer Pembayaran */}
                    <div className="p-6 bg-slate-900 rounded-b-3xl border-t border-slate-700">
                        <div className="flex justify-between mb-2 text-slate-400 text-sm">
                            <span>Subtotal</span>
                            <span>Rp {totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between mb-6 text-2xl font-bold text-white">
                            <span>Total</span>
                            <span className="text-emerald-400">Rp {totalAmount.toLocaleString()}</span>
                        </div>

                        <button
                            onClick={() => setIsCheckoutModalOpen(true)}
                            disabled={cart.length === 0 || processing}
                            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-900/50 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? <Loader2 className="animate-spin" /> : <Banknote />}
                            BAYAR SEKARANG
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}