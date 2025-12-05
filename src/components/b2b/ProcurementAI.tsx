'use client';

import { useState } from 'react';
import { Bot, Send, Loader2, FileCheck, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProcurementAI() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [recommendation, setRecommendation] = useState<any>(null);
    const [req, setReq] = useState({ tonase: '', durasi: 'Spot Purchase', rasa: 'Manis Renyah' });

    const handleConsult = async () => {
        setLoading(true);

        try {
            const res = await fetch('/api/procurement-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(req)
            });

            const data = await res.json();

            if (data.error) throw new Error(data.error);

            setRecommendation(data);
            setStep(2);
            toast.success("Analisis Selesai!");

        } catch (error) {
            toast.error("Gagal menganalisis. Coba lagi.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return (
        <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 z-50 bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 animate-bounce hover:animate-none transition"
        >
            <Bot size={24} /> <span className="font-bold pr-2 hidden md:inline">AI Procurement Assistant</span>
        </button>
    );

    return (
        <div className="fixed bottom-8 right-8 z-50 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-10">
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                    <Bot size={20} className="text-emerald-400" />
                    <h3 className="font-bold">Supplier Consultant AI</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-6 bg-slate-50 min-h-[300px]">
                {step === 1 ? (
                    <div className="space-y-4">
                        <p className="text-sm text-slate-600 mb-4">Saya akan bantu hitung estimasi harga dan rekomendasi varietas terbaik untuk kebutuhan industri Anda.</p>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Kebutuhan Volume (Ton)</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded-lg mt-1 focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="Cth: 5"
                                value={req.tonase}
                                onChange={e => setReq({ ...req, tonase: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Tipe Kontrak</label>
                            <select
                                className="w-full p-2 border rounded-lg mt-1 focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={req.durasi}
                                onChange={e => setReq({ ...req, durasi: e.target.value })}
                            >
                                <option>Spot Purchase (Sekali Beli)</option>
                                <option>Kontrak 3 Bulan</option>
                                <option>Kontrak 6 Bulan</option>
                                <option>Kontrak 1 Tahun</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Preferensi Rasa/Tekstur</label>
                            <select
                                className="w-full p-2 border rounded-lg mt-1 focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={req.rasa}
                                onChange={e => setReq({ ...req, rasa: e.target.value })}
                            >
                                <option>Manis Renyah (Crunchy)</option>
                                <option>Manis Lembut (Soft/Melting)</option>
                                <option>Aroma Kuat (Musky)</option>
                                <option>Tahan Simpan Lama</option>
                            </select>
                        </div>

                        <button
                            onClick={handleConsult}
                            disabled={loading || !req.tonase}
                            className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl mt-4 flex justify-center items-center gap-2 hover:bg-emerald-700 disabled:opacity-50 transition"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Send size={16} />} Analisis Kebutuhan
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white p-5 rounded-xl border border-emerald-100 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-xs text-slate-400 uppercase font-bold">Rekomendasi AI</p>
                                <span className="text-[10px] bg-slate-100 px-2 py-1 rounded font-mono text-slate-600">Claude Sonnet 4.5</span>
                            </div>
                            <h4 className="text-xl font-bold text-emerald-700 mb-2">{recommendation?.variety}</h4>
                            <p className="text-2xl font-black text-slate-900 mb-3">{recommendation?.price_est}</p>

                            <div className="text-xs text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-100 flex items-start gap-2">
                                <FileCheck size={14} className="shrink-0 mt-0.5" />
                                <span>{recommendation?.savings}</span>
                            </div>
                        </div>

                        <div className="text-sm text-slate-600 italic bg-white p-4 rounded-xl border border-slate-200 shadow-sm leading-relaxed">
                            "{recommendation?.reason}"
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="w-full py-3 border border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={16} /> Ulangi
                            </button>
                            <button
                                onClick={() => {
                                    alert("Draft kontrak dikirim ke email!");
                                    setIsOpen(false);
                                }}
                                className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-lg"
                            >
                                Buat Draft
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}