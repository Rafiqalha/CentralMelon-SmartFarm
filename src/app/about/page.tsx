'use client';

import Navbar from '@/components/Navbar';
import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Leaf, Users, Sprout } from 'lucide-react';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const MILESTONES = [
    {
        year: '2020',
        title: 'Benih Pertama',
        desc: 'Bermula dari garasi rumah seluas 200m², kami bereksperimen menanam melon Golden Apollo. Tanpa IoT, hanya ketekunan manual dan mimpi besar.',
        image: 'https://images.unsplash.com/photo-1535438414045-70dbc0464d5a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        year: '2022',
        title: 'Integrasi Teknologi',
        desc: 'Kami menyadari cara konvensional tidak cukup. Central Melon mulai mengembangkan sistem IoT mandiri untuk mengontrol nutrisi dan suhu presisi.',
        image: 'https://images.unsplash.com/photo-1597787185613-cf51d79fa7e4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        year: '2024',
        title: 'Ekspansi & Kolaborasi',
        desc: 'Kini mengelola 5 Hektar Smart Greenhouse dan bermitra dengan 50+ petani lokal. Membawa teknologi pertanian modern ke level komunitas.',
        image: 'https://images.unsplash.com/photo-1727412800488-4e56ee3e262e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
];

const VALUES = [
    { icon: Target, title: 'Presisi', desc: 'Data-driven farming untuk hasil konsisten.' },
    { icon: Leaf, title: 'Keberlanjutan', desc: 'Zero pesticide residue & hemat air.' },
    { icon: Users, title: 'Komunitas', desc: 'Tumbuh bersama petani lokal.' },
];

export default function AboutPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // 1. Hero Animation - Smooth Rise
        const heroTl = gsap.timeline();
        // Set initial state explicitly
        gsap.set('.hero-content', { autoAlpha: 0, y: 30 });

        heroTl.to('.hero-content', {
            y: 0,
            autoAlpha: 1,
            duration: 1.2,
            ease: 'power2.out',
            delay: 0.1
        });

        // 2. Values Cards Animation - Staggered Batch
        // Using batch for better performance on grids
        ScrollTrigger.batch('.value-card', {
            start: 'top 85%',
            onEnter: (batch) => {
                gsap.fromTo(batch,
                    { autoAlpha: 0, y: 40 },
                    {
                        autoAlpha: 1,
                        y: 0,
                        stagger: 0.15,
                        duration: 0.8,
                        ease: 'back.out(1.2)',
                        overwrite: true
                    }
                );
            },
            once: true // Play once for cleaner UX
        });

        // 3. Timeline Animation (Zig-Zag) - Coordinated Flow
        const items = gsap.utils.toArray<HTMLElement>('.milestone-item');

        items.forEach((item, i) => {
            const isLeft = i % 2 === 0;
            const img = item.querySelector('.milestone-img');
            const txt = item.querySelector('.milestone-text');
            const dot = item.querySelector('.milestone-dot');

            // Set initial states hidden
            gsap.set(img, { x: isLeft ? -50 : 50, autoAlpha: 0 });
            gsap.set(txt, { x: isLeft ? 30 : -30, autoAlpha: 0 });
            gsap.set(dot, { scale: 0, autoAlpha: 0 });

            // Create a timeline for each row
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%', // Trigger when top of item hits 80% of viewport
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse' // Replay on scroll up for nice effect
                }
            });

            // Sequence: Dot pops -> Image slides -> Text slides
            tl.to(dot, { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(1.7)' })
                .to(img, { x: 0, autoAlpha: 1, duration: 0.8, ease: 'power2.out' }, '-=0.2')
                .to(txt, { x: 0, autoAlpha: 1, duration: 0.8, ease: 'power2.out' }, '-=0.6');
        });

    }, { scope: containerRef });

    return (
        <main ref={containerRef} className="min-h-screen bg-white text-slate-900 overflow-x-hidden font-sans">
            <Navbar />

            {/* --- HERO SECTION --- */}
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-slate-900">
                    <Image
                        src="https://images.unsplash.com/photo-1524486361537-8ad15938e1a3?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Greenhouse"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-slate-900/40 via-transparent to-slate-900/90"></div>
                </div>

                <div className="relative z-10 text-center px-6 max-w-4xl hero-content opacity-0">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
                        <Sprout size={16} /> Since 2020
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                        Merevolusi Pertanian Lewat <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-400">Teknologi</span>
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
                        Kami percaya bahwa melon premium bukan hanya soal rasa, tapi tentang bagaimana kita merawat bumi dan memberdayakan petani dengan kecerdasan data.
                    </p>
                </div>
            </section>

            {/* --- VALUES SECTION --- */}
            <section className="py-24 px-6 bg-slate-50 values-section">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {VALUES.map((val, idx) => (
                        <div key={idx} className="value-card opacity-0 bg-white p-10 rounded-4xl shadow-sm border border-gray-100 text-center hover:shadow-xl hover:-translate-y-2 transition duration-500 group">
                            <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition duration-500">
                                <val.icon size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{val.title}</h3>
                            <p className="text-slate-500 leading-relaxed">{val.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- HISTORY TIMELINE --- */}
            <section className="py-32 px-6 max-w-6xl mx-auto">
                <div className="text-center mb-24">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">Perjalanan Kami</h2>
                    <p className="text-slate-500 text-lg">Dari eksperimen kecil hingga ekosistem smart farming.</p>
                </div>

                <div className="space-y-32 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-emerald-100 before:via-emerald-300 before:to-emerald-100 before:hidden md:before:block">
                    {MILESTONES.map((milestone, idx) => (
                        <div key={idx} className={`milestone-item relative flex flex-col md:flex-row items-center justify-between group ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>

                            {/* Dot Tengah Timeline */}
                            <div className="milestone-dot flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-emerald-500 shadow-lg shrink-0 absolute left-0 md:left-1/2 -ml-6 md:ml-0 translate-x-0 md:-translate-x-1/2 z-10 md:flex">
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>

                            {/* Gambar */}
                            <div className={`milestone-img opacity-0 w-full md:w-[45%] bg-white p-3 rounded-4xl border border-gray-100 shadow-xl ${idx % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                                <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-3xl">
                                    <Image
                                        src={milestone.image}
                                        alt={milestone.title}
                                        fill
                                        className="object-cover hover:scale-105 transition duration-1000"
                                    />
                                    <div className="absolute top-6 left-6 bg-white/95 backdrop-blur px-5 py-2 rounded-full text-sm font-bold text-emerald-800 shadow-md">
                                        {milestone.year}
                                    </div>
                                </div>
                            </div>

                            {/* Teks - Spacer untuk Mobile */}
                            <div className="h-8 md:hidden"></div>

                            {/* Teks Content */}
                            <div className={`milestone-text opacity-0 w-full md:w-[45%] bg-white p-8 md:p-10 rounded-4xl border border-gray-100 shadow-sm hover:shadow-md transition duration-500 ${idx % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'}`}>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{milestone.title}</h3>
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    {milestone.desc}
                                </p>
                            </div>

                        </div>
                    ))}
                </div>
            </section>

            {/* --- STATS SECTION --- */}
            <section className="bg-[#0b1120] py-32 px-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -ml-40 -mb-40 pointer-events-none"></div>

                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
                    {[
                        { label: 'Greenhouse Area', val: '5 Ha' },
                        { label: 'Total Panen', val: '120 Ton' },
                        { label: 'Mitra Petani', val: '50+' },
                        { label: 'Kepuasan Klien', val: '98%' },
                    ].map((stat, idx) => (
                        <div key={idx} className="group cursor-default">
                            <p className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-400 mb-3 group-hover:scale-110 transition duration-300 inline-block">
                                {stat.val}
                            </p>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em] group-hover:text-emerald-300 transition">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

        </main>
    );
}