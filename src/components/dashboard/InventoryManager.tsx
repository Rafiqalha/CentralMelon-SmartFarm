'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Minus, Trash2, Loader2, UploadCloud, Image as ImageIcon, Save, Sparkles } from 'lucide-react';

// Tipe Data Produk
type Product = {
    id: number;
    name: string;
    category: string;
    grade: string;
    stock: number;
    price: number;
    brix: string;
    moq: string;
    image_url: string;
    description: string;
};

export default function InventoryManager() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false); // State loading upload
    const [isAddMode, setIsAddMode] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateCaption = async () => {
        if (!newProduct.name) {
            alert("Isi nama produk dulu, baru AI bisa bekerja!");
            return;
        }

        setIsGenerating(true);
        try {
            const response = await fetch('/api/generate-caption', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productName: newProduct.name,
                    category: newProduct.category
                })
            });

            const data = await response.json();
            if (data.caption) {
                // Update kolom deskripsi otomatis
                setNewProduct(prev => ({ ...prev, description: data.caption }));
            }
        } catch (error) {
            alert("Gagal menghubungi AI. Coba lagi.");
        } finally {
            setIsGenerating(false);
        }
    };

    // State Form
    const [newProduct, setNewProduct] = useState({
        name: '', category: 'Net Melon', grade: 'Grade A', price: 0, stock: 0,
        brix: '12-14 Brix', moq: 'Min 10kg', description: '', image_url: ''
    });

    // State File Gambar Asli
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // 1. FETCH DATA
    const fetchProducts = async () => {
        setLoading(true);
        const { data } = await supabase.from('products').select('*').order('id', { ascending: true });
        if (data) setProducts(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // 2. FUNGSI HANDLE FILE (PREVIEW)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // Buat preview lokal
        }
    };

    // 3. FUNGSI UPLOAD KE SUPABASE
    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            setUploading(true);
            // Buat nama file unik: timestamp-namafile
            const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;

            // Upload ke bucket 'products'
            const { data, error } = await supabase.storage
                .from('products')
                .upload(fileName, file);

            if (error) throw error;

            // Ambil Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(fileName);

            return publicUrl;
        } catch (error) {
            alert('Gagal upload gambar!');
            console.error(error);
            return null;
        } finally {
            setUploading(false);
        }
    };

    // 4. FUNGSI TAMBAH PRODUK (SUBMIT)
    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        let finalImageUrl = newProduct.image_url;

        // Jika ada file dipilih, upload dulu
        if (selectedFile) {
            const uploadedUrl = await uploadImage(selectedFile);
            if (uploadedUrl) finalImageUrl = uploadedUrl;
        }
        // Jika tidak ada file dan tidak ada URL, pakai gambar default
        else if (!finalImageUrl) {
            finalImageUrl = 'https://images.unsplash.com/photo-1594314948625-b44c2084478f?q=80&w=800';
        }

        const payload = { ...newProduct, image_url: finalImageUrl };

        const { error } = await supabase.from('products').insert(payload);

        if (!error) {
            setIsAddMode(false);
            fetchProducts();
            // Reset form completely
            setNewProduct({ name: '', category: 'Net Melon', grade: 'Grade A', price: 0, stock: 0, brix: '', moq: '', description: '', image_url: '' });
            setSelectedFile(null);
            setPreviewUrl(null);
        } else {
            alert('Gagal database: ' + error.message);
        }
        setLoading(false);
    };

    // 5. UPDATE STOCK & DELETE
    const updateStock = async (id: number, currentStock: number, change: number) => {
        const newStock = currentStock + change;
        if (newStock < 0) return;
        setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
        await supabase.from('products').update({ stock: newStock }).eq('id', id);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Yakin hapus?")) return;
        await supabase.from('products').delete().eq('id', id);
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    // STYLE KHUSUS INPUT (Agar Font Jelas Terlihat)
    const inputClass = "w-full p-3 border border-gray-300 rounded-lg text-slate-900 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition";

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-1 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Manajemen Stok & Produk</h3>
                    <p className="text-gray-500 text-sm">Upload produk dan atur stok real-time.</p>
                </div>
                <button
                    onClick={() => setIsAddMode(!isAddMode)}
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition flex items-center gap-2"
                >
                    {isAddMode ? 'Batal' : '+ Tambah Produk'}
                </button>
            </div>

            {/* FORM INPUT */}
            {isAddMode && (
                <form onSubmit={handleAddProduct} className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200 animate-in slide-in-from-top-2">
                    <h4 className="font-bold text-slate-900 mb-4">Input Produk Baru</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Input Text Biasa */}
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Nama Produk</label>
                            <input required placeholder="Contoh: Golden Apollo" className={inputClass} value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Kategori</label>
                            <select className={inputClass} value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                                <option value="Net Melon">Net Melon</option>
                                <option value="Smooth Skin">Smooth Skin</option>
                                <option value="Exotic">Exotic</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Harga (Rp)</label>
                            <input required type="number" placeholder="0" className={inputClass} value={newProduct.price || ''} onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })} />
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Stok Awal</label>
                            <input required type="number" placeholder="0" className={inputClass} value={newProduct.stock || ''} onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })} />
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Tingkat Manis (Brix)</label>
                            <input placeholder="14-16 Brix" className={inputClass} value={newProduct.brix} onChange={e => setNewProduct({ ...newProduct, brix: e.target.value })} />
                        </div>

                        {/* --- UPLOAD GAMBAR (FITUR BARU) --- */}
                        <div className="md:col-span-2">
                            <label className="text-xs text-gray-500 mb-1 block">Foto Produk (Upload)</label>
                            <div className="flex items-center gap-4">
                                {/* Area Upload */}
                                <div className="flex-1 relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className={`w-full p-3 border-2 border-dashed rounded-lg flex items-center justify-center gap-2 cursor-pointer transition ${selectedFile ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'}`}>
                                        <UploadCloud size={20} />
                                        <span className="text-sm font-medium">
                                            {selectedFile ? selectedFile.name : "Klik untuk upload foto"}
                                        </span>
                                    </div>
                                </div>

                                {/* Preview Gambar */}
                                {previewUrl && (
                                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm shrink-0">
                                        <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-xs text-gray-500 block">Deskripsi</label>

                            {/* TOMBOL AI MAGIC */}
                            <button
                                type="button" // Penting biar gak submit form
                                onClick={handleGenerateCaption}
                                disabled={isGenerating || !newProduct.name}
                                className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-800 font-bold disabled:opacity-50 transition"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 size={12} className="animate-spin" /> Sedang Berpikir...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={12} /> Generate with AI
                                    </>
                                )}
                            </button>
                        </div>

                        <textarea
                            required
                            placeholder={isGenerating ? "AI sedang menulis deskripsi terbaik untuk Anda..." : "Jelaskan rasa dan tekstur melon..."}
                            className={`${inputClass} ${isGenerating ? 'animate-pulse bg-purple-50' : ''}`}
                            rows={3}
                            value={newProduct.description}
                            onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                        />
                    </div>

                    <button disabled={loading || uploading} className="mt-4 bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold w-full hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2">
                        {(loading || uploading) ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                        {uploading ? 'Mengupload Gambar...' : loading ? 'Menyimpan...' : 'Simpan Produk'}
                    </button>
                </form>
            )}

            {/* TABEL STOK */}
            <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50">
                        <tr className="text-gray-500 text-xs uppercase tracking-wider">
                            <th className="p-4">Foto</th>
                            <th className="p-4">Produk</th>
                            <th className="p-4 text-center">Stok</th>
                            <th className="p-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                        {products.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50 transition">
                                <td className="p-4 w-16">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
                                        {/* LOGIKA: Cek dulu apakah ada URL gambar? */}
                                        {p.image_url && p.image_url !== "" ? (
                                            <img
                                                src={p.image_url}
                                                alt={p.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            /* JIKA KOSONG: Tampilkan Ikon Placeholder */
                                            <ImageIcon className="text-gray-400" size={20} />
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 font-bold text-slate-800">
                                    {p.name}
                                    <div className="text-xs text-gray-400 font-normal mt-0.5">{p.category} • {p.grade}</div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg w-fit mx-auto px-2 py-1 shadow-sm">
                                        <button onClick={() => updateStock(p.id, p.stock, -1)} className="w-6 h-6 rounded bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition"><Minus size={12} /></button>
                                        <span className={`font-mono font-bold w-8 text-center ${p.stock === 0 ? 'text-red-500' : 'text-slate-800'}`}>{p.stock}</span>
                                        <button onClick={() => updateStock(p.id, p.stock, 1)} className="w-6 h-6 rounded bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600 flex items-center justify-center transition"><Plus size={12} /></button>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}