'use client';

import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Image as ImageIcon, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
    const { items, updateQuantity, removeFromCart, totalPrice } = useCart(); 
    const [customerName, setCustomerName] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [errors, setErrors] = useState({ name: false, address: false });
    const [isGenerating, setIsGenerating] = useState(false);

    const formatRp = (num: number) => "Rp " + num.toLocaleString('id-ID');

    const handleCheckout = async () => {
        setErrors({ name: false, address: false });
        let hasError = false;
        if (!customerName.trim()) {
            setErrors(prev => ({ ...prev, name: true }));
            hasError = true;
        }
        if (!customerAddress.trim()) {
            setErrors(prev => ({ ...prev, address: true }));
            hasError = true;
        }

        if (hasError) {
            toast.error("Mohon lengkapi Nama dan Alamat pengiriman!");
            return;
        }

        setIsGenerating(true);
        const loadingToast = toast.loading("AI sedang mendeteksi lokasi maps...");

        try {
            const response = await fetch('/api/detect-location', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: customerAddress }),
            });

            const data = await response.json();
            const mapLink = data.map_link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customerAddress)}`;

            let message = `Halo Central Melon, saya ingin memesan:\n\n`;
            items.forEach((item, index) => {
                message += `${index + 1}. ${item.name} (${item.grade}) - ${item.quantity}x @ ${formatRp(item.price)}\n`;
            });
            message += `\nTotal: *${formatRp(totalPrice)}*`;
            message += `\n\n📋 Data Pemesan:`;
            message += `\nNama: ${customerName}`;
            message += `\nAlamat: ${customerAddress}`;
            message += `\n\n📍 Lokasi Maps (AI Detected):\n${mapLink}`;
            message += `\n\nMohon diproses, terima kasih!`;

            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/6285709477872?text=${encodedMessage}`, '_blank');

            toast.success("Mengarahkan ke WhatsApp...", { id: loadingToast });

        } catch (error) {
            toast.error("Gagal generate maps, menggunakan alamat teks.", { id: loadingToast });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            <Navbar />

            <div className="pt-32 max-w-6xl mx-auto px-6">
                <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <ShoppingBag className="text-emerald-600" size={32} /> Keranjang Belanja
                </h1>

                {items.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
                        <h2 className="text-xl font-bold text-gray-600">Keranjang Kosong</h2>
                        <p className="text-gray-400 mb-8">Belum ada melon segar yang dipilih.</p>
                        <Link href="/products">
                            <button className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200">
                                Mulai Belanja
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LIST ITEM */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-center transition hover:shadow-md">
                                    <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="text-gray-400" size={24} />
                                        )}
                                    </div>

                                    <div className="grow">
                                        <h3 className="font-bold text-slate-900">{item.name}</h3>
                                        <p className="text-xs text-emerald-600 font-bold uppercase">{item.grade}</p>
                                        <p className="text-sm text-gray-500 mt-1">{formatRp(item.price)} / item</p>
                                    </div>

                                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600 hover:text-red-500 transition"><Minus size={16} /></button>
                                        <span className="font-bold text-slate-900 w-4 text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600 hover:text-emerald-500 transition"><Plus size={16} /></button>
                                    </div>

                                    <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-300 hover:text-red-500 transition bg-transparent hover:bg-red-50 rounded-lg">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}

                            <Link href="/products" className="inline-flex items-center text-emerald-600 font-bold mt-4 hover:underline group">
                                <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Tambah Produk Lain
                            </Link>
                        </div>

                        {/* FORM CHECKOUT */}
                        <div className="lg:col-span-1 h-fit">
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-emerald-50/50 sticky top-32">
                                <h3 className="font-bold text-xl text-slate-900 mb-6 border-b border-gray-100 pb-4">Ringkasan Pesanan</h3>

                                <div className="flex justify-between mb-2 text-gray-500 text-sm">
                                    <span>Total Item</span>
                                    <span>{items.reduce((acc, i) => acc + i.quantity, 0)} Pcs</span>
                                </div>
                                <div className="flex justify-between mb-8 text-2xl font-bold text-slate-900">
                                    <span>Total</span>
                                    <span className="text-emerald-600">{formatRp(totalPrice)}</span>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">
                                            Nama Penerima <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={customerName}
                                            onChange={(e) => {
                                                setCustomerName(e.target.value);
                                                if (e.target.value) setErrors(prev => ({ ...prev, name: false }));
                                            }}
                                            className={`w-full p-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 transition ${errors.name ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : 'border-gray-200'}`}
                                            placeholder="Nama Lengkap"
                                        />
                                        {errors.name && <p className="text-xs text-red-500 mt-1 ml-1">Nama wajib diisi</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">
                                            Alamat Lengkap <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <textarea
                                                rows={3}
                                                value={customerAddress}
                                                onChange={(e) => {
                                                    setCustomerAddress(e.target.value);
                                                    if (e.target.value) setErrors(prev => ({ ...prev, address: false }));
                                                }}
                                                className={`w-full p-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 transition resize-none ${errors.address ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : 'border-gray-200'}`}
                                                placeholder="Jalan, Kota, Kode Pos..."
                                            />
                                            <MapPin className="absolute bottom-3 right-3 text-gray-400 pointer-events-none" size={18} />
                                        </div>
                                        {errors.address && <p className="text-xs text-red-500 mt-1 ml-1">Alamat wajib diisi</p>}
                                        <p className="text-[10px] text-emerald-600 mt-1 ml-1 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                            AI akan membuat link maps otomatis
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={isGenerating}
                                    className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isGenerating ? (
                                        <span className="flex items-center gap-2 animate-pulse">Mendeteksi Lokasi...</span>
                                    ) : (
                                        <>Checkout WhatsApp <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                                    )}
                                </button>
                                <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
                                    Pesanan akan diteruskan ke Admin untuk konfirmasi stok & hitung ongkir.
                                </p>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </main>
    );
}