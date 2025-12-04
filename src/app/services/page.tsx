'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Sprout, Wifi, BookOpen, ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register Plugin (Wajib di Next.js)
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const SERVICES = [
    {
        id: 'greenhouse',
        title: 'Greenhouse Construction',
        desc: 'Jasa pembangunan greenhouse standar industri dengan material UV-proof dan sirkulasi udara optimal.',
        icon: Sprout,
        slug: 'greenhouse-construction'
    },
    {
        id: 'iot',
        title: 'IoT Installation',
        desc: 'Pemasangan sensor tanah, suhu (DHT22), dan otomatisasi pompa irigasi berbasis mikrokontroler.',
        icon: Wifi,
        slug: 'iot-installation'
    },
    {
        id: 'education',
        title: 'Agro Education',
        desc: 'Pelatihan intensif budidaya melon premium dari semai hingga panen, beserta manajemen nutrisi AB Mix.',
        icon: BookOpen,
        slug: 'agro-education'
    }
];

export default function ServicesPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // 1. Setup Awal: Sembunyikan elemen (supaya tidak glitch saat loading)
        // Kita gunakan autoAlpha (opacity + visibility) agar performa lebih baik
        gsap.set('.hero-item', { y: 50, autoAlpha: 0 });
        gsap.set('.service-card', { y: 100, autoAlpha: 0 });

        // 2. Animasi Hero (Judul & Teks) - Muncul Langsung
        gsap.to('.hero-item', {
            y: 0,
            autoAlpha: 1, // Munculkan
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            delay: 0.2 // Sedikit delay agar transisi halaman selesai dulu
        });

        // 3. Animasi Grid Card (Batch)
        // Batch sangat stabil untuk Grid. Dia otomatis mengelompokkan elemen yang muncul bersamaan.
        ScrollTrigger.batch('.service-card', {
            onEnter: (elements) => {
                gsap.to(elements, {
                    y: 0,
                    autoAlpha: 1,
                    stagger: 0.2, // Kartu muncul berurutan
                    duration: 0.8,
                    ease: 'back.out(1.2)', // Efek memantul sedikit biar smooth
                    overwrite: 'auto'
                });
            },
            start: 'top 90%', // Mulai animasi ketika bagian atas kartu masuk 90% viewport (sedikit masuk layar)
            once: true // Hanya jalan sekali (biar tidak hilang lagi saat scroll atas)
        });

    }, { scope: containerRef });

    return (
        <main ref={containerRef} className="min-h-screen bg-[#0f172a] text-white">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 text-center relative z-10">
                {/* Tambahkan class 'hero-item' untuk target animasi */}
                <div className="hero-item">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
                        Layanan Smart Farming
                    </h1>
                </div>
                <div className="hero-item">
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Kami membantu Anda membangun ekosistem pertanian masa depan dengan teknologi presisi dan infrastruktur modern.
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="pb-32 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {SERVICES.map((service) => (
                        <div
                            key={service.id}
                            // Class 'service-card' penting untuk target animasi
                            // 'invisible' di class Tailwind dihapus, kita handle full di GSAP
                            className="service-card bg-slate-800/50 border border-slate-700 p-8 rounded-3xl hover:border-emerald-500/50 transition-all duration-300 group flex flex-col hover:bg-slate-800 hover:shadow-2xl hover:shadow-emerald-900/20"
                        >
                            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-lg">
                                <service.icon size={28} />
                            </div>

                            <h3 className="text-xl font-bold mb-3 group-hover:text-emerald-400 transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
                                {service.desc}
                            </p>

                            <Link href={`/services/${service.slug}`}>
                                <button className="flex items-center gap-2 text-emerald-400 font-bold text-sm hover:text-emerald-300 transition-all group/btn bg-emerald-500/10 px-4 py-2 rounded-lg hover:bg-emerald-500 w-fit">
                                    Lihat Detail Layanan
                                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}