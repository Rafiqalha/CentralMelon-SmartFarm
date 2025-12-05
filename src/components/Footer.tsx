'use client';

import Link from 'next/link';
import { Sprout, MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Twitter, ArrowRight } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">

            {/* Newsletter & CTA */}
            <div className="border-b border-white/5 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-bold text-white">Siap mendigitalkan kebun Anda?</h3>
                        <p className="text-slate-400 mt-2">Dapatkan analisis pasar dan update teknologi melon terbaru.</p>
                    </div>
                    <div className="flex w-full md:w-auto gap-2">
                        <input
                            type="email"
                            placeholder="Masukkan email bisnis Anda"
                            className="px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 w-full md:w-80"
                        />
                        <button className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition flex items-center gap-2">
                            Langganan <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Informasi Utama */}
            <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                {/* Brand & About */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-white">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                            <Sprout size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold leading-none">Central Melon</h2>
                            <p className="text-[10px] tracking-widest text-emerald-500 font-bold uppercase">Premium Farm</p>
                        </div>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-400">
                        Platform rantai pasok melon premium terintegrasi IoT pertama di Indonesia. Kami menghubungkan petani modern dengan pasar global.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition"><Instagram size={18} /></a>
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition"><Linkedin size={18} /></a>
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-400 hover:text-white transition"><Twitter size={18} /></a>
                    </div>
                </div>

                {/* Navigasi Cepat */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-6">Perusahaan</h3>
                    <ul className="space-y-4 text-sm">
                        <li><Link href="/about" className="hover:text-emerald-400 transition">Tentang Kami</Link></li>
                        <li><Link href="/services" className="hover:text-emerald-400 transition">Layanan Smart Farming</Link></li>
                        <li><Link href="/products" className="hover:text-emerald-400 transition">Katalog Grosir</Link></li>
                        <li><Link href="/career" className="hover:text-emerald-400 transition">Karir (Hiring)</Link></li>
                        <li><Link href="/blog" className="hover:text-emerald-400 transition">Blog & Berita</Link></li>
                    </ul>
                </div>

                {/* Kontak Resmi */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-6">Hubungi Kami</h3>
                    <ul className="space-y-4 text-sm">
                        <li className="flex items-start gap-3">
                            <MapPin className="shrink-0 text-emerald-500 mt-1" size={20} />
                            <span>Sumbersari, Kec. Udanawu, Kab. Blitar, Jawa Timur 66154</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone className="shrink-0 text-emerald-500" size={20} />
                            <span>085709477872</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail className="shrink-0 text-emerald-500" size={20} />
                            <span>admin@centralmelon.com</span>
                        </li>
                    </ul>
                </div>

                {/* Peta Lokasi (Google Maps) */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-6">Lokasi Kantor</h3>
                    <div className="rounded-xl overflow-hidden border border-slate-700 h-48 w-full relative bg-slate-800 shadow-lg">

                        {/* Embed Google Maps: Lokasi Udanawu, Blitar */}
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.941916323696!2d112.03761007500742!3d-8.004944692021025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78e34cb099a9b5%3A0x1356b56bd673d635!2sKaranggondang%2C%20Kec.%20Udanawu%2C%20Kabupaten%20Blitar%2C%20Jawa%20Timur!5e0!3m2!1sid!2sid!4v1708500000000!5m2!1sid!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="grayscale hover:grayscale-0 transition duration-700 ease-in-out opacity-80 hover:opacity-100"
                        ></iframe>

                    </div>
                    <a
                        href="https://maps.google.com/?q=Karanggondang,+Kec.+Udanawu,+Kabupaten+Blitar,+Jawa+Timur+66154"
                        target="_blank"
                        className="text-xs text-emerald-400 mt-3 font-medium hover:text-emerald-300 flex items-center gap-1 transition group"
                    >
                        Buka di Google Maps <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>

            </div>

            {/* Copyright */}
            <div className="bg-black/20 py-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>© {new Date().getFullYear()} Central Melon Tbk. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-emerald-400">Privacy Policy</a>
                        <a href="#" className="hover:text-emerald-400">Terms of Service</a>
                        <a href="#" className="hover:text-emerald-400">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}