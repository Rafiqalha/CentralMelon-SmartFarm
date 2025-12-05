'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Leaf } from 'lucide-react';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
    const heroRef = useRef(null);
    const textRef = useRef(null);
    const aboutRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(textRef.current, {
                y: 100,
                opacity: 0,
                duration: 1.5,
                ease: 'power4.out',
                delay: 0.2
            });

            gsap.from('.about-item', {
                scrollTrigger: {
                    trigger: aboutRef.current,
                    start: 'top 80%',
                },
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out'
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={heroRef} className="w-full">
            <div className="relative h-screen w-full bg-slate-900 flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 opacity-40 bg-cover bg-center scale-110"
                    style={{ backgroundImage: "url('https://plus.unsplash.com/premium_photo-1675040830254-1d5148d9d0dc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWVsb258ZW58MHx8MHx8fDA%3D')" }}
                ></div>

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto" ref={textRef}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm mb-6 backdrop-blur-sm">
                        <Leaf size={16} /> Agriculture 4.0 Has Arrived
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                        Modern Farming for <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-400">Premium Melon</span>
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                        Rasakan manisnya inovasi. Kami menggabungkan bibit unggul dengan teknologi IoT Smart Farming untuk hasil panen kualitas ekspor.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/products">
                            <button className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold transition flex items-center gap-2">
                                Lihat Produk <ArrowRight size={20} />
                            </button>
                        </Link>
                        <Link href="/contact">
                            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full font-semibold transition">
                                Konsultasi Greenhouse
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <div ref={aboutRef} className="py-24 bg-white text-slate-900">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="about-item">
                        <h2 className="text-4xl font-bold mb-6 text-slate-800">Tentang <span className="text-emerald-600">Central Melon</span></h2>
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                            Berawal dari lahan tidur, kini menjadi pusat inovasi. Central Melon berdiri dengan misi sederhana:
                            <span className="font-semibold text-slate-900"> Memodernisasi pertanian lokal</span>.
                        </p>
                        <p className="text-gray-600 mb-8">
                            Kami tidak hanya menanam melon. Kami menerapkan sistem **Precision Farming**, **Drip Irrigation**, dan sensor **IoT** untuk memastikan setiap tetes air dan nutrisi terserap sempurna. Hasilnya? Melon Grade A yang konsisten.
                        </p>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <h4 className="font-bold text-2xl text-emerald-700 mb-1">98%</h4>
                                <p className="text-sm text-gray-600">Panen Premium</p>
                            </div>
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <h4 className="font-bold text-2xl text-emerald-700 mb-1">IoT</h4>
                                <p className="text-sm text-gray-600">Powered System</p>
                            </div>
                        </div>
                    </div>

                    <div className="about-item relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
                        <div
                            className="absolute inset-0 bg-cover bg-center hover:scale-105 transition duration-700"
                            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1621961458348-f013d219b50c?q=80&w=2070&auto=format&fit=crop')" }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}