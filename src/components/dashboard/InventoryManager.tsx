'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Minus, Trash2, Package, Save, Loader2, Search, UploadCloud, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

type Product = {
    id: number;
    name: string;
    category: string;
    grade: string;
    brix: string;
    moq: number;
    capacity_week: number;
    lead_time: string;
    seasonality: string;
    stock: number;
    price_ton: number;
    image_url: string;
    description: string;
};

export default function InventoryManager() {
    const supabase = createClient();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddMode, setIsAddMode] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [newProduct, setNewProduct] = useState({
        name: '',
        category: 'Net Melon',
        grade: 'A',
        brix: '12-14',
        moq: 1000,
        capacity_week: 5,
        lead_time: '3 Hari',
        seasonality: 'Stable',
        price_ton: 0,
        stock: 0,
        description: '',
        image_url: ''
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        const { data } = await supabase.from('products').select('*').order('id', { ascending: true });
        if (data) setProducts(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            setUploading(true);
            const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
            const { error } = await supabase.storage.from('products').upload(fileName, file);
            if (error) throw error;

            const { data } = supabase.storage.from('products').getPublicUrl(fileName);
            return data.publicUrl;
        } catch (error) {
            toast.error("Gagal upload gambar");
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        let finalImageUrl = newProduct.image_url;
        if (selectedFile) {
            const url = await uploadImage(selectedFile);
            if (url) finalImageUrl = url;
        }

        const payload = { ...newProduct, image_url: finalImageUrl };
        const { error } = await supabase.from('products').insert(payload);

        if (!error) {
            setIsAddMode(false);
            fetchProducts();
            toast.success("Produk B2B Berhasil Ditambahkan!");

            setNewProduct({
                name: '', category: 'Net Melon', grade: 'A', brix: '', moq: 1000,
                capacity_week: 5, lead_time: '3 Hari', seasonality: 'Stable',
                price_ton: 0, stock: 0, description: '', image_url: ''
            });
            setSelectedFile(null);
            setPreviewUrl(null);
        } else {
            toast.error("Gagal: " + error.message);
        }
        setLoading(false);
    };

    const updateStock = async (id: number, currentStock: number, change: number) => {
        const newStock = currentStock + change;
        if (newStock < 0) return;
        setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
        await supabase.from('products').update({ stock: newStock }).eq('id', id);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Hapus produk ini dari katalog?")) return;
        await supabase.from('products').delete().eq('id', id);
        setProducts(prev => prev.filter(p => p.id !== id));
        toast.success("Produk dihapus");
    };

    const inputClass = "w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-800";

    return (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm col-span-1 lg:col-span-2">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-slate-900">Manajemen Katalog B2B</h3>
                    <p className="text-gray-500 text-sm mt-1">Atur spesifikasi teknis dan ketersediaan stok grosir.</p>
                </div>
                <button
                    onClick={() => setIsAddMode(!isAddMode)}
                    className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition flex items-center gap-2 shadow-lg shadow-slate-200"
                >
                    {isAddMode ? 'Batal' : '+ Tambah Produk Baru'}
                </button>
            </div>

            {/* FORM INPUT B2B */}
            {isAddMode && (
                <form onSubmit={handleAddProduct} className="mb-10 p-8 bg-gray-50/50 rounded-3xl border border-gray-200 animate-in slide-in-from-top-4">
                    <h4 className="font-bold text-slate-900 mb-6 text-lg">Input Spesifikasi Produk</h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Kolom 1: Info Dasar */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nama Varietas</label>
                                <input required placeholder="Contoh: Golden Apollo" className={inputClass} value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Kategori</label>
                                <select className={inputClass} value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                                    <option>Net Melon</option>
                                    <option>Smooth Skin</option>
                                    <option>Exotic</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Harga / Ton (IDR)</label>
                                <input required type="number" placeholder="0" className={inputClass} value={newProduct.price_ton || ''} onChange={e => setNewProduct({ ...newProduct, price_ton: Number(e.target.value) })} />
                            </div>
                        </div>

                        {/* Kolom 2: Spesifikasi Teknis */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Grade</label>
                                    <select className={inputClass} value={newProduct.grade} onChange={e => setNewProduct({ ...newProduct, grade: e.target.value })}>
                                        <option>AA</option>
                                        <option>A</option>
                                        <option>B</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Brix</label>
                                    <input placeholder="14-16" className={inputClass} value={newProduct.brix} onChange={e => setNewProduct({ ...newProduct, brix: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">MOQ (Kg)</label>
                                    <input type="number" placeholder="1000" className={inputClass} value={newProduct.moq || ''} onChange={e => setNewProduct({ ...newProduct, moq: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Stok Awal</label>
                                    <input type="number" placeholder="0" className={inputClass} value={newProduct.stock || ''} onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })} />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Supply Cap (Ton/Week)</label>
                                <input type="number" placeholder="5" className={inputClass} value={newProduct.capacity_week || ''} onChange={e => setNewProduct({ ...newProduct, capacity_week: Number(e.target.value) })} />
                            </div>
                        </div>

                        {/* Kolom 3: Logistik & Gambar */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Lead Time</label>
                                    <input placeholder="3 Hari" className={inputClass} value={newProduct.lead_time} onChange={e => setNewProduct({ ...newProduct, lead_time: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Seasonality</label>
                                    <input placeholder="Stable" className={inputClass} value={newProduct.seasonality} onChange={e => setNewProduct({ ...newProduct, seasonality: e.target.value })} />
                                </div>
                            </div>

                            {/* Upload Gambar */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Foto Produk</label>
                                <div className="relative h-24 border-2 border-dashed border-gray-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition cursor-pointer flex flex-col items-center justify-center text-gray-400 overflow-hidden group">
                                    {previewUrl ? (
                                        <img src={previewUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <UploadCloud size={20} />
                                            <span className="text-[10px] mt-1">Upload JPG/PNG</span>
                                        </div>
                                    )}
                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} accept="image/*" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Deskripsi Teknis</label>
                        <textarea placeholder="Jelaskan tekstur, aroma, dan ketahanan simpan..." className={inputClass} rows={2} value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                    </div>

                    <button disabled={loading || uploading} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-70">
                        {(loading || uploading) ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        {uploading ? 'Mengupload Gambar...' : 'Simpan ke Katalog B2B'}
                    </button>
                </form>
            )}

            {/* TABEL KATALOG */}
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50">
                        <tr className="text-gray-500 text-xs uppercase tracking-wider font-bold">
                            <th className="p-4 pl-6">Produk</th>
                            <th className="p-4">Specs (Grade/Brix)</th>
                            <th className="p-4">Kapasitas Supply</th>
                            <th className="p-4 text-center">Stok Gudang</th>
                            <th className="p-4 text-right pr-6">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                        {products.map((p) => (
                            <tr key={p.id} className="hover:bg-emerald-50/30 transition group">
                                <td className="p-4 pl-6 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 shrink-0 flex items-center justify-center">
                                        {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-400" size={20} />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{p.name}</p>
                                        <p className="text-xs text-gray-500">{p.category}</p>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold mr-2">{p.grade}</span>
                                    <span className="text-slate-500 text-xs">{p.brix}</span>
                                </td>
                                <td className="p-4">
                                    <p className="font-medium text-slate-800">{p.capacity_week} Ton/Wk</p>
                                    <p className="text-xs text-gray-400">MOQ: {p.moq} Kg</p>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg w-fit mx-auto px-2 py-1 shadow-sm">
                                        <button onClick={() => updateStock(p.id, p.stock, -10)} className="w-6 h-6 rounded hover:bg-red-100 text-slate-400 hover:text-red-600 flex items-center justify-center transition"><Minus size={12} /></button>
                                        <span className={`font-mono font-bold w-10 text-center ${p.stock === 0 ? 'text-red-500' : 'text-slate-800'}`}>{p.stock}</span>
                                        <button onClick={() => updateStock(p.id, p.stock, 10)} className="w-6 h-6 rounded hover:bg-emerald-100 text-slate-400 hover:text-emerald-600 flex items-center justify-center transition"><Plus size={12} /></button>
                                    </div>
                                </td>
                                <td className="p-4 text-right pr-6">
                                    <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && products.length === 0 && <div className="text-center py-10 text-gray-400">Katalog Kosong</div>}
            </div>
        </div>
    );
}