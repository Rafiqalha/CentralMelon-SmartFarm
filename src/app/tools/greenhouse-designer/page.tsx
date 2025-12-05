'use client';

import Navbar from '@/components/Navbar';
import { useState } from 'react';
import { Sprout, Ruler, MapPin, Wind, Sun, ArrowRight, Loader2, Hammer, Droplets, Grid } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GreenhouseDesigner() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const [formData, setFormData] = useState({
        landWidth: 10,
        landLength: 20,
        plantType: 'Melon Premium (Net)',
        location: 'Dataran Rendah, Panas Terik',
    });

    const handleGenerate = async () => {
        setLoading(true);
        setStep(2); 

        try {
            const res = await fetch('/api/design-greenhouse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            setResult(data);
            setStep(3); 
        } catch (error) {
            alert("Gagal generate desain. Coba lagi.");
            setStep(1);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <Navbar />

            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                        ✨ AI Architect Beta
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
                        Rancang <span className="text-emerald-600">Smart Greenhouse</span> Impian Anda
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        Masukkan data lahan, biarkan AI kami menghitung konstruksi, layout, dan material yang paling efisien untuk budget Anda.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden min-h-[600px]">

                    {/* --- INPUT FORM --- */}
                    <div className="lg:col-span-4 p-8 bg-slate-900 text-white flex flex-col justify-center relative overflow-hidden">
                        {/* Dekorasi Background */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                        <div className="relative z-10 space-y-6">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Dimensi Lahan (Meter)</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* INPUT LEBAR */}
                                    <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                                        <span className="text-xs text-slate-500 mb-1 block">Lebar</span>
                                        <div className="flex items-center gap-2">
                                            <Ruler size={18} className="text-emerald-400" />
                                            <input
                                                type="number"
                                                value={formData.landWidth}
                                                onChange={(e) => setFormData({ ...formData, landWidth: parseInt(e.target.value) || 0 })}
                                                className="bg-transparent w-full outline-none font-bold text-lg"
                                            />
                                        </div>
                                    </div>

                                    {/* INPUT PANJANG */}
                                    <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                                        <span className="text-xs text-slate-500 mb-1 block">Panjang</span>
                                        <div className="flex items-center gap-2">
                                            <Ruler size={18} className="text-emerald-400" />
                                            <input
                                                type="number"
                                                value={formData.landLength}
                                                onChange={(e) => setFormData({ ...formData, landLength: parseInt(e.target.value) || 0 })}
                                                className="bg-transparent w-full outline-none font-bold text-lg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Komoditas Tanaman</label>
                                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex items-center gap-3">
                                    <Sprout size={20} className="text-emerald-400" />
                                    <select
                                        className="bg-transparent w-full outline-none font-medium option:bg-slate-900"
                                        value={formData.plantType}
                                        onChange={(e) => setFormData({ ...formData, plantType: e.target.value })}
                                    >
                                        <option className="bg-slate-900">Melon Premium (Net)</option>
                                        <option className="bg-slate-900">Golden Melon (Smooth)</option>
                                        <option className="bg-slate-900">Semangka Inul</option>
                                        <option className="bg-slate-900">Paprika / Cabai</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Kondisi Lingkungan</label>
                                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex items-center gap-3">
                                    <MapPin size={20} className="text-emerald-400" />
                                    <select
                                        className="bg-transparent w-full outline-none font-medium"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    >
                                        <option className="bg-slate-900">Dataran Rendah (Panas)</option>
                                        <option className="bg-slate-900">Dataran Tinggi (Sejuk/Lembab)</option>
                                        <option className="bg-slate-900">Area Angin Kencang (Pantai)</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-900/50 transition flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <Grid />}
                                {loading ? 'Sedang Menghitung...' : 'Generate Desain'}
                            </button>
                        </div>
                    </div>

                    {/* --- RESULT AREA --- */}
                    <div className="lg:col-span-8 p-8 bg-gray-50 flex flex-col relative min-h-[500px]">

                        {/* IDLE */}
                        {step === 1 && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                                    <Hammer size={48} className="text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-400">Siap Merancang?</h3>
                                <p className="text-slate-400 max-w-sm mt-2">Isi data di sebelah kiri untuk melihat rekomendasi konstruksi AI.</p>
                            </div>
                        )}

                        {/* LOADING ANIMATION */}
                        {step === 2 && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full mb-6"
                                />
                                <h3 className="text-xl font-bold text-slate-800">AI Sedang Menganalisis...</h3>
                                <div className="flex flex-col gap-2 mt-4 text-sm text-gray-500">
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>🔍 Menganalisis arah angin & suhu...</motion.p>
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>📐 Menghitung beban struktur rangka...</motion.p>
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>🌱 Mengoptimalkan populasi tanaman...</motion.p>
                                </div>
                            </div>
                        )}

                        {/* RESULT UI PREMIUM */}
                        {step === 3 && result && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col gap-6">

                                {/* 1. HEADER HASIL */}
                                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Rekomendasi AI</p>
                                        </div>
                                        <h2 className="text-2xl font-extrabold text-slate-900">{result?.type || 'Desain Kustom'}</h2>
                                        <p className="text-slate-500 text-sm max-w-md">{result?.reason}</p>
                                    </div>
                                    <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl text-right min-w-[140px]">
                                        <p className="text-[10px] uppercase text-slate-400 font-bold">Kapasitas Maksimal</p>
                                        <p className="text-2xl font-bold">{result?.layout?.total_capacity || 0}</p>
                                        <p className="text-xs text-emerald-400 font-medium">Tanaman</p>
                                    </div>
                                </div>

                                {/* 2. GRID SPESIFIKASI */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Kartu Rangka */}
                                    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-50">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Hammer size={20} /></div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm">Struktur & Rangka</h4>
                                                <p className="text-xs text-gray-400">Ketahanan fisik bangunan</p>
                                            </div>
                                        </div>
                                        <ul className="space-y-3">
                                            <li className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Material Utama</span>
                                                <span className="font-semibold text-slate-800 text-right max-w-[50%]">{result?.frame_material || '-'}</span>
                                            </li>
                                            <li className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Tinggi Tiang (Column)</span>
                                                <span className="font-semibold text-slate-800">{result?.specs?.column_height || 0}m</span>
                                            </li>
                                            <li className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Lebar Bentangan</span>
                                                <span className="font-semibold text-slate-800">{result?.specs?.span_width || 0}m</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Kartu Covering */}
                                    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-50">
                                            <div className="p-2 bg-orange-50 text-orange-600 rounded-xl"><Sun size={20} /></div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm">Iklim & Proteksi</h4>
                                                <p className="text-xs text-gray-400">Pengendalian suhu & hama</p>
                                            </div>
                                        </div>
                                        <ul className="space-y-3">
                                            <li className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Plastik UV</span>
                                                <span className="font-semibold text-slate-800">{result?.specs?.plastic_uv || '-'}</span>
                                            </li>
                                            <li className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Insect Net</span>
                                                <span className="font-semibold text-slate-800">{result?.specs?.insect_net || '-'}</span>
                                            </li>
                                            <li className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Sistem Pendingin</span>
                                                <span className="font-semibold text-slate-800 text-right max-w-[50%] truncate">{result?.cooling_system || '-'}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* 3. VISUALISASI LAYOUT (BLUEPRINT STYLE) */}
                                <div className="bg-[#1e293b] rounded-3xl p-6 text-white flex-1 flex flex-col relative overflow-hidden border border-slate-700">
                                    {/* Header Visualizer */}
                                    <div className="flex justify-between items-center mb-6 relative z-10">
                                        <div>
                                            <h4 className="font-bold flex items-center gap-2"><Grid size={18} className="text-emerald-400" /> Blueprint Layout</h4>
                                            <p className="text-xs text-slate-400 mt-1">Tampak Atas (Top View)</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-emerald-400">{result?.layout?.total_beds || 0}</p>
                                            <p className="text-[10px] uppercase text-slate-400 font-bold">Total Lajur</p>
                                        </div>
                                    </div>

                                    {/* Area Gambar (Responsive Flex) */}
                                    <div className="flex-1 border-2 border-dashed border-slate-600 rounded-xl p-4 flex justify-center gap-2 items-center relative bg-[#0f172a]/50">
                                        {/* Render Baris Bedengan */}
                                        {Array.from({ length: Math.min(result?.layout?.total_beds || 0, 10) }).map((_, i) => (
                                            <div key={i} className="h-full w-full max-w-10 bg-emerald-600/20 border border-emerald-500/50 rounded flex flex-col items-center justify-center gap-1 group relative">
                                                {/* Tanaman (Dots) */}
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>

                                                {/* Tooltip */}
                                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                                                    Lajur {i + 1}
                                                </span>
                                            </div>
                                        ))}

                                        {/* Indikator Jika Lebih dari 10 */}
                                        {(result?.layout?.total_beds || 0) > 10 && (
                                            <div className="h-full flex items-center justify-center px-2 text-slate-500 text-xs font-bold">
                                                +{(result?.layout?.total_beds || 0) - 10} lagi
                                            </div>
                                        )}
                                    </div>

                                    {/* Legend */}
                                    <div className="flex gap-4 mt-4 text-[10px] text-slate-400 justify-center">
                                        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500/50 border border-emerald-500 rounded"></span> Bedengan Tanam</div>
                                        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-[#0f172a]/50 border border-slate-600 border-dashed rounded"></span> Jalan (Pathway {result?.layout?.pathway_width})</div>
                                    </div>
                                </div>

                                {/* 4. TOMBOL AKSI */}
                                <a
                                    href={`https://wa.me/6285709477872?text=Halo%20Central%20Melon,%20saya%20tertarik%20dengan%20desain%20${encodeURIComponent(result?.type)}%20untuk%20lahan%20${formData.landWidth}x${formData.landLength}m.`}
                                    target="_blank"
                                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition hover:scale-[1.01] active:scale-95"
                                >
                                    Konsultasikan & Minta RAB <ArrowRight size={18} />
                                </a>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </main>
    );
}