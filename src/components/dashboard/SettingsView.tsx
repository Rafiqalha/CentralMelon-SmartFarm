'use client';

import { useState } from 'react';
import { User, Store, Bell, Shield, Save, Smartphone, Printer, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsView() {
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);

    // State Simulasi Data (Nanti bisa diganti dengan data dari Supabase)
    const [formData, setFormData] = useState({
        farmName: 'Central Melon Premium',
        address: 'Karanggondang, Kec. Udanawu, Blitar',
        whatsapp: '+62 812-3456-7890',
        email: 'admin@centralmelon.com',
        lowStockAlert: 10,
        taxRate: 11,
        enableEmailNotif: true,
        enableWANotif: true,
        printerType: 'Thermal 58mm'
    });

    const handleSave = () => {
        setLoading(true);
        // Simulasi Request API
        setTimeout(() => {
            setLoading(false);
            toast.success("Pengaturan berhasil disimpan!");
        }, 1500);
    };

    const tabs = [
        { id: 'general', label: 'Profil Kebun', icon: Store },
        { id: 'account', label: 'Akun Admin', icon: User },
        { id: 'notifications', label: 'Notifikasi', icon: Bell },
        { id: 'system', label: 'Sistem & POS', icon: Smartphone },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* --- SIDEBAR MENU PENGATURAN --- */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 bg-slate-900 text-white">
                        <h3 className="font-bold text-lg">Pengaturan</h3>
                        <p className="text-xs text-slate-400">Konfigurasi sistem</p>
                    </div>
                    <div className="p-2 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === tab.id
                                    ? 'bg-emerald-50 text-emerald-600 shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- KONTEN PENGATURAN --- */}
            <div className="lg:col-span-3">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[500px]">

                    {/* TAB: PROFIL KEBUN */}
                    {activeTab === 'general' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Informasi Kebun & Bisnis</h2>
                                <p className="text-gray-500 text-sm">Data ini akan muncul di struk dan footer website.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2">Nama Usaha</label>
                                    <input
                                        type="text"
                                        value={formData.farmName}
                                        onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2">WhatsApp Bisnis</label>
                                    <input
                                        type="text"
                                        value={formData.whatsapp}
                                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 mb-2">Alamat Lengkap</label>
                                    <textarea
                                        rows={3}
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: AKUN */}
                    {activeTab === 'account' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Profil Administrator</h2>
                                <p className="text-gray-500 text-sm">Kelola informasi login dan keamanan.</p>
                            </div>

                            <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
                                    <User size={40} />
                                </div>
                                <div>
                                    <button className="px-4 py-2 bg-white border border-gray-300 text-slate-700 font-bold rounded-lg text-sm hover:bg-gray-50">Upload Foto Baru</button>
                                    <p className="text-xs text-gray-400 mt-2">JPG, PNG max 2MB</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2">Email Login</label>
                                <input
                                    type="email"
                                    disabled
                                    value={formData.email}
                                    className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <button className="text-red-500 font-bold text-sm flex items-center gap-2 hover:bg-red-50 px-4 py-2 rounded-lg transition w-fit">
                                    <Shield size={16} /> Ganti Password
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TAB: NOTIFIKASI */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Preferensi Notifikasi</h2>
                                <p className="text-gray-500 text-sm">Atur kapan Anda ingin menerima peringatan.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <h4 className="font-bold text-slate-800">Peringatan Stok Menipis</h4>
                                        <p className="text-xs text-gray-500">Beri tahu jika stok produk di bawah batas aman.</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={formData.lowStockAlert}
                                            onChange={(e) => setFormData({ ...formData, lowStockAlert: parseInt(e.target.value) })}
                                            className="w-16 p-2 text-center rounded-lg border border-gray-300 text-sm"
                                        />
                                        <span className="text-sm font-bold text-slate-600">Unit</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <h4 className="font-bold text-slate-800">Notifikasi Pesanan Baru (Email)</h4>
                                        <p className="text-xs text-gray-500">Kirim email saat ada checkout via website.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={formData.enableEmailNotif} onChange={(e) => setFormData({ ...formData, enableEmailNotif: e.target.checked })} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: SISTEM & POS */}
                    {activeTab === 'system' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Konfigurasi POS & Sistem</h2>
                                <p className="text-gray-500 text-sm">Pengaturan teknis aplikasi kasir.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2">Pajak PPN (%)</label>
                                    <input
                                        type="number"
                                        value={formData.taxRate}
                                        onChange={(e) => setFormData({ ...formData, taxRate: parseInt(e.target.value) })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2">Tipe Printer Struk</label>
                                    <select
                                        value={formData.printerType}
                                        onChange={(e) => setFormData({ ...formData, printerType: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                                    >
                                        <option>Thermal 58mm</option>
                                        <option>Thermal 80mm</option>
                                        <option>Dot Matrix</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                        <h4 className="text-sm font-bold text-yellow-800 flex items-center gap-2"><Printer size={16} /> Mode Cetak</h4>
                                        <p className="text-xs text-yellow-700 mt-1">Saat ini sistem menggunakan Web Print API browser. Pastikan printer sudah terhubung sebagai default printer di komputer.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FOOTER ACTIONS */}
                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-emerald-600 transition shadow-lg flex items-center gap-2 disabled:opacity-70"
                        >
                            {loading ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span> : <Save size={18} />}
                            Simpan Perubahan
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}