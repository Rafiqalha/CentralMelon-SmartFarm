'use client';

import Navbar from '@/components/Navbar';
import MelonChat from '@/components/ui/MelonChat';
import { Mail, MapPin, Phone, Clock, ArrowRight } from 'lucide-react';

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Header Section */}
            <section className="pt-32 pb-12 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
                        Pusat Bantuan & <span className="text-emerald-600">Konsultasi AI</span>
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Hubungi tim kami secara langsung atau ngobrol dengan MelonBot untuk respon instan 24/7 seputar pertanian cerdas.
                    </p>
                </div>
            </section>

            {/* Content Grid */}
            <section className="pb-20 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* KOLOM KIRI: INFO KONTAK MANUAL */}
                    <div className="space-y-8">
                        {/* Kartu Kontak */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-2xl font-bold text-slate-800 mb-6">Kantor Pusat</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">Alamat Studio Tani</p>
                                        <p className="text-gray-500 leading-relaxed mt-1">
                                            Karanggondang, Kec. Udanawu,<br />
                                            Kabupaten Blitar, Jawa Timur 66154
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">Email Bisnis</p>
                                        <p className="text-gray-500 mt-1">partnership@centralmelon.com</p>
                                        <p className="text-gray-500">support@centralmelon.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">WhatsApp Official</p>
                                        <p className="text-gray-500 mt-1">+62 812-3456-7890</p>
                                        <a href="https://wa.me/628123456789" target="_blank" className="text-emerald-600 font-bold text-sm mt-2 flex items-center gap-1 hover:underline">
                                            Chat WhatsApp <ArrowRight size={14} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Jam Operasional */}
                        <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <Clock className="text-emerald-400" />
                                    <h3 className="text-xl font-bold">Jam Operasional</h3>
                                </div>
                                <ul className="space-y-3 text-slate-300">
                                    <li className="flex justify-between border-b border-white/10 pb-2">
                                        <span>Senin - Jumat</span>
                                        <span className="font-bold text-white">08:00 - 17:00</span>
                                    </li>
                                    <li className="flex justify-between border-b border-white/10 pb-2">
                                        <span>Sabtu</span>
                                        <span className="font-bold text-white">09:00 - 15:00</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Minggu</span>
                                        <span className="text-red-400 font-bold">Tutup</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* KOLOM KANAN: AI CHATBOT (EMBEDDED) */}
                    <div className="lg:sticky lg:top-32">
                        <div className="mb-4">
                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                ✨ New Feature
                            </span>
                            <h3 className="text-2xl font-bold text-slate-900 mt-2">Tanya MelonBot</h3>
                            <p className="text-gray-500">Dapatkan jawaban instan tentang produk & kemitraan.</p>
                        </div>

                        {/* KOMPONEN CHAT */}
                        <MelonChat />

                    </div>

                </div>
            </section>
        </main>
    );
}