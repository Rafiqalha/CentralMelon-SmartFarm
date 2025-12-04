'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, UploadCloud, ScanLine, Loader2, CheckCircle, XCircle, FileText, Activity } from 'lucide-react';

export default function MelonLensPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null); // Untuk dikirim ke API
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 1. Handle File Upload & Convert to Base64
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Preview URL
            setSelectedImage(URL.createObjectURL(file));
            setResult(null); // Reset hasil sebelumnya

            // Convert to Base64 (Format yang dibutuhkan Gemini API)
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                // Hapus prefix "data:image/jpeg;base64," agar bersih saat dikirim
                const cleanBase64 = base64String.split(',')[1];
                setImageBase64(cleanBase64);
            };
            reader.readAsDataURL(file);
        }
    };

    // 2. Fungsi Scan ke API
    const handleScan = async () => {
        if (!imageBase64) return;

        setLoading(true);
        try {
            const response = await fetch('/api/analyze-melon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageBase64 }),
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            alert("Terjadi kesalahan saat analisis AI.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                <Link href="/dashboard?view=analytics" className="p-2 bg-white rounded-full hover:bg-gray-100 transition shadow-sm">
                    <ArrowLeft size={20} className="text-slate-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">MelonLens AI Scanner</h1>
                    <p className="text-gray-500 text-sm">Deteksi Kualitas & Varietas Melon Berbasis Computer Vision (Gemini 2.0)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* --- KOLOM KIRI: UPLOAD AREA --- */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl h-80 flex flex-col items-center justify-center cursor-pointer transition relative overflow-hidden ${selectedImage ? 'border-emerald-500' : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/30'}`}
                    >
                        {selectedImage ? (
                            <img src={selectedImage} alt="Preview" className="w-full h-full object-contain p-4" />
                        ) : (
                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <UploadCloud size={32} />
                                </div>
                                <p className="font-bold text-slate-700">Klik untuk Upload Foto Melon</p>
                                <p className="text-xs text-gray-400 mt-2">Support JPG, PNG (Max 5MB)</p>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    <button
                        onClick={handleScan}
                        disabled={!selectedImage || loading}
                        className="w-full mt-6 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <><Loader2 className="animate-spin" /> Menganalisis...</>
                        ) : (
                            <><ScanLine size={20} /> Mulai Scan AI</>
                        )}
                    </button>
                </div>

                {/* --- KOLOM KANAN: HASIL ANALISIS --- */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit min-h-[400px] flex flex-col justify-center">

                    {!result && !loading && (
                        <div className="text-center text-gray-400">
                            <ScanLine size={64} className="mx-auto mb-4 opacity-20" />
                            <p>Hasil analisis AI akan muncul di sini.</p>
                        </div>
                    )}

                    {loading && (
                        <div className="text-center">
                            <Loader2 size={48} className="animate-spin text-emerald-500 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-700">Sedang Menganalisis Biometrik...</h3>
                            <p className="text-sm text-gray-500">Mendeteksi tekstur kulit dan warna...</p>
                        </div>
                    )}

                    {result && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {result.is_melon ? (
                                <>
                                    <div className="flex items-center gap-3 mb-6 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                        <CheckCircle className="text-emerald-600" size={32} />
                                        <div>
                                            <h3 className="font-bold text-emerald-800 text-lg">Melon Terdeteksi</h3>
                                            <p className="text-emerald-600 text-sm">Tingkat Keyakinan: {result.confidence}%</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Varietas</p>
                                            <h2 className="text-3xl font-extrabold text-slate-900">{result.variety}</h2>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-gray-50 rounded-xl">
                                                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Activity size={12} /> Tekstur Kulit</p>
                                                <p className="font-semibold text-slate-800 text-sm">{result.skin_texture}</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-xl">
                                                <p className="text-xs text-gray-500 mb-1">Warna Dasar</p>
                                                <p className="font-semibold text-slate-800 text-sm">{result.skin_color}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Kesimpulan AI</p>
                                            <p className="text-slate-600 leading-relaxed text-sm bg-blue-50 p-4 rounded-xl border border-blue-100">
                                                {result.analysis}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-6 bg-red-50 rounded-2xl border border-red-100">
                                    <XCircle className="text-red-500 mx-auto mb-3" size={48} />
                                    <h3 className="text-xl font-bold text-red-700">Objek Tidak Dikenali</h3>
                                    <p className="text-red-600 mt-2">{result.analysis}</p>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}