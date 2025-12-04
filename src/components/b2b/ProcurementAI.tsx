'use client';

import { useState } from 'react';
import { Bot, Send, Loader2, FileCheck } from 'lucide-react';

export default function ProcurementAI() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [recommendation, setRecommendation] = useState<any>(null);

    // Form State
    const [req, setReq] = useState({ tonase: '', durasi: 'Spot', rasa: 'Manis Renyah' });

    const handleConsult = async () => {
        setLoading(true);
        // Simulasi AI Logic (Nanti bisa diganti API route Gemini)
        setTimeout(() => {
            setRecommendation({
                variety: 'Golden Apollo (Grade AA)',
                price_est: 'Rp 12.500.000 / Ton',
                reason: 'Berdasarkan volume 5 Ton dan preferensi "Manis Renyah", varietas ini memiliki shelf-life terbaik untuk pengiriman jarak jauh dan tekstur yang stabil.',
                savings: 'Hemat 5% untuk kontrak 3 bulan'
            });
            setStep(2);
            setLoading(false);
        }, 2000);
    };

    if (!isOpen) return (
        <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 z-50 bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 animate-bounce"
        >
            <Bot size={24} /> <span className="font-bold pr-2">AI Procurement Assistant</span>
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
                            <input type="number" className="w-full p-2 border rounded-lg mt-1" placeholder="Cth: 5" onChange={e => setReq({ ...req, tonase: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Tipe Kontrak</label>
                            <select className="w-full p-2 border rounded-lg mt-1" onChange={e => setReq({ ...req, durasi: e.target.value })}>
                                <option>Spot Purchase (Sekali Beli)</option>
                                <option>Kontrak 3 Bulan</option>
                                <option>Kontrak 1 Tahun</option>
                            </select>
                        </div>

                        <button
                            onClick={handleConsult}
                            disabled={loading || !req.tonase}
                            className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl mt-4 flex justify-center items-center gap-2 hover:bg-emerald-700 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Send size={16} />} Analisis Kebutuhan
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in">
                        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
                            <p className="text-xs text-slate-400 uppercase font-bold mb-1">Rekomendasi AI</p>
                            <h4 className="text-xl font-bold text-emerald-700">{recommendation.variety}</h4>
                            <p className="text-2xl font-black text-slate-900 my-2">{recommendation.price_est}</p>
                            <p className="text-xs text-emerald-600 bg-emerald-50 p-2 rounded border border-emerald-100 flex items-center gap-2">
                                <FileCheck size={12} /> {recommendation.savings}
                            </p>
                        </div>
                        <div className="text-sm text-slate-600 italic bg-white p-3 rounded-lg border border-slate-100">
                            "{recommendation.reason}"
                        </div>
                        <button
                            onClick={() => { alert("Draft kontrak dikirim ke email!"); setIsOpen(false); }}
                            className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800"
                        >
                            Buat Draft Kontrak
                        </button>
                        <button onClick={() => setStep(1)} className="w-full py-2 text-slate-500 text-xs hover:text-slate-800">
                            Ulangi Analisis
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}