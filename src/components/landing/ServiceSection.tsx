'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sprout, Wifi, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link'; // Import Link

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        icon: <Sprout size={40} />,
        title: "Greenhouse Construction",
        desc: "Jasa pembangunan greenhouse standar industri dengan material UV-proof dan sirkulasi udara optimal.",
        link: "/contact?service=greenhouse" // Link spesifik
    },
    {
        icon: <Wifi size={40} />,
        title: "IoT Installation",
        desc: "Pemasangan sensor tanah, suhu (DHT22), dan otomatisasi pompa irigasi berbasis mikrokontroler.",
        link: "/contact?service=iot"
    },
    {
        icon: <BookOpen size={40} />,
        title: "Agro Education",
        desc: "Pelatihan intensif budidaya melon premium dari semai hingga panen, beserta manajemen nutrisi AB Mix.",
        link: "/contact?service=training"
    }
];

export default function ServiceSection() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Kita ubah animasinya agar lebih aman.
            // Menggunakan 'batch' atau trigger yang lebih sensitif
            gsap.fromTo(".service-card",
                { y: 50, opacity: 0 }, // State Awal
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 85%", // Memicu animasi lebih cepat (saat 15% masuk layar)
                    }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={sectionRef} className="py-24 bg-slate-900 text-white min-h-screen flex flex-col justify-center">
            <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Layanan Smart Farming</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">Kami membantu Anda membangun ekosistem pertanian masa depan.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((svc, idx) => (
                        // Card Wrapper
                        <div
                            key={idx}
                            className="service-card opacity-0 bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-emerald-500 hover:bg-slate-800/80 transition duration-300 group flex flex-col h-full"
                        >
                            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition duration-300 shadow-lg shadow-emerald-900/20">
                                {svc.icon}
                            </div>

                            <h3 className="text-xl font-bold mb-3 text-white">{svc.title}</h3>

                            <p className="text-gray-400 leading-relaxed mb-8 grow">
                                {svc.desc}
                            </p>

                            {/* BUTTON AREA */}
                            <div className="mt-auto">
                                <Link href={svc.link}>
                                    <button className="flex items-center gap-2 text-emerald-400 text-sm font-bold group-hover:text-emerald-300 transition-colors py-2">
                                        Minta Penawaran <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}