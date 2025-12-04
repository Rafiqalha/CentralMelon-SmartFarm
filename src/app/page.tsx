'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight, Sprout, Cpu, BarChart3, GraduationCap,
  Play, ChevronRight, Star, Globe, ShieldCheck, Zap,
  TrendingUp, Leaf, Database, MessageSquare, CheckCircle,
  Smartphone
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

// Register GSAP
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// --- DUMMY DATA FOR CHARTS ---
const IOT_DATA = [
  { time: '08:00', temp: 24, humidity: 60 },
  { time: '10:00', temp: 28, humidity: 55 },
  { time: '12:00', temp: 32, humidity: 50 },
  { time: '14:00', temp: 31, humidity: 52 },
  { time: '16:00', temp: 29, humidity: 58 },
  { time: '18:00', temp: 26, humidity: 65 },
];

const HARVEST_PREDICTION = [
  { month: 'Jun', output: 12 },
  { month: 'Jul', output: 15 },
  { month: 'Aug', output: 18 }, // Peak
  { month: 'Sep', output: 14 },
  { month: 'Oct', output: 16 },
];

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  useGSAP(() => {
    // 1. CINEMATIC HERO REVEAL
    const tl = gsap.timeline();

    // Background Zoom Effect (Ken Burns)
    gsap.to('.hero-bg-img', {
      scale: 1.1,
      duration: 10,
      ease: 'none',
      repeat: -1,
      yoyo: true
    });

    tl.fromTo('.hero-title-word',
      { y: 100, opacity: 0, rotate: 3 },
      { y: 0, opacity: 1, rotate: 0, duration: 1, stagger: 0.1, ease: 'power3.out' }
    )
      .fromTo('.hero-desc',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 }, '-=0.5'
      )
      .fromTo('.hero-btn',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, '-=0.4'
      );

    // 2. SCROLL ANIMATIONS (Reveal sections)
    gsap.utils.toArray('.reveal-on-scroll').forEach((elem: any) => {
      gsap.fromTo(elem,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: elem,
            start: 'top 85%',
          }
        }
      );
    });

    // 3. PRODUCT PARALLAX
    gsap.to('.product-floating-img', {
      y: -50,
      scrollTrigger: {
        trigger: '.product-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });

  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500 selection:text-white overflow-x-hidden font-sans">
      <Navbar />

      {/* =========================================
          1. CINEMATIC HERO (TESLA STYLE)
         ========================================= */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1708796705570-33fd29ef67d0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Futuristic Greenhouse"
            fill
            className="hero-bg-img object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-[#050505]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)]"></div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto mt-20">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-in fade-in zoom-in duration-1000">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-300">The Future of Agriculture</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
            <div className="overflow-hidden">
              <span className="hero-title-word inline-block text-white">Central</span>
            </div>
            <div className="overflow-hidden">
              <span className="hero-title-word inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">Melon</span>
            </div>
            <div className="overflow-hidden">
              <span className="hero-title-word inline-block text-slate-400">Future.</span>
            </div>
          </h1>

          <p className="hero-desc text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Revolusi pertanian 4.0. Menggabungkan kecerdasan buatan, IoT, dan bioteknologi untuk menghasilkan melon kualitas ekspor dengan konsistensi suplai industri.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/products">
              <button className="hero-btn px-10 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-emerald-400 transition-all flex items-center gap-2 group">
                Lihat Katalog B2B <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/services/iot-installation">
              <button className="hero-btn px-10 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full font-bold text-lg backdrop-blur-md transition-all flex items-center gap-2">
                Teknologi Kami
              </button>
            </Link>
          </div>
        </div>

        {/* Floating Data Widget (Decoration) */}
        <div className="absolute bottom-10 right-10 hidden lg:block animate-in slide-in-from-right duration-1000 delay-500">
          <div className="bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10 w-64">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Live System</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-2xl font-mono font-bold text-white">28.4°C</p>
                <p className="text-[10px] text-slate-400">Avg. Temp</p>
              </div>
              <div>
                <p className="text-2xl font-mono font-bold text-emerald-400">92%</p>
                <p className="text-[10px] text-slate-400">Humidity</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          2. TECH SHOWCASE (IOT & AI)
         ========================================= */}
      <section className="py-32 px-6 bg-[#050505] relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          <div className="reveal-on-scroll order-2 lg:order-1">
            <div className="bg-slate-900/50 border border-white/10 p-6 rounded-3xl backdrop-blur-sm shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2"><Cpu size={20} className="text-emerald-400" /> Real-time Monitoring</h3>
                <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">CONNECTED</span>
              </div>
              {/* Simulated Chart */}
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={IOT_DATA}>
                    <defs>
                      <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                      itemStyle={{ color: '#e2e8f0' }}
                    />
                    <Area type="monotone" dataKey="temp" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-black/20 p-3 rounded-xl border border-white/5 text-center">
                  <Zap size={16} className="mx-auto text-yellow-400 mb-1" />
                  <p className="text-xs text-slate-400">Energy</p>
                  <p className="font-bold">Optimal</p>
                </div>
                <div className="bg-black/20 p-3 rounded-xl border border-white/5 text-center">
                  <Sprout size={16} className="mx-auto text-emerald-400 mb-1" />
                  <p className="text-xs text-slate-400">Growth</p>
                  <p className="font-bold">+12%</p>
                </div>
                <div className="bg-black/20 p-3 rounded-xl border border-white/5 text-center">
                  <ShieldCheck size={16} className="mx-auto text-blue-400 mb-1" />
                  <p className="text-xs text-slate-400">Health</p>
                  <p className="font-bold">Good</p>
                </div>
              </div>
            </div>
          </div>

          <div className="reveal-on-scroll order-1 lg:order-2">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Data-Driven <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-300">Precision Farming.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Kami tidak menebak. Kami mengukur. Setiap tetes air dan nutrisi dikontrol oleh algoritma AI untuk memastikan efisiensi maksimal dan kualitas buah yang seragam.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-300">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Leaf size={14} /></span>
                Pengurangan penggunaan air hingga 40%
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Database size={14} /></span>
                Traceability penuh dari benih ke panen
              </li>
            </ul>
            <Link href="/services/iot-installation">
              <button className="text-emerald-400 font-bold hover:text-emerald-300 flex items-center gap-2">
                Pelajari Sistem IoT <ChevronRight size={16} />
              </button>
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================
          3. PREMIUM PRODUCT (GOLDEN APOLLO)
         ========================================= */}
      <section className="product-section py-32 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 text-center mb-16 reveal-on-scroll">
          <span className="text-yellow-500 font-bold tracking-widest text-xs uppercase mb-2 block">Our Masterpiece</span>
          <h2 className="text-5xl md:text-7xl font-serif italic text-white mb-6">Golden Apollo</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Varian eksklusif dengan tekstur "Melts in your mouth" dan tingkat kemanisan di atas 15 Brix. Standar baru kemewahan buah tropis.</p>
        </div>

        <div className="relative max-w-5xl mx-auto h-[500px] flex items-center justify-center">
          {/* Floating Specs */}
          <div className="absolute left-0 top-10 md:left-20 animate-bounce duration-3000 reveal-on-scroll">
            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-xl text-left">
              <p className="text-xs text-slate-400 uppercase">Sweetness</p>
              <p className="text-2xl font-bold text-yellow-400">16+ Brix</p>
            </div>
          </div>
          <div className="absolute right-0 bottom-20 md:right-20 animate-bounce duration-4000 reveal-on-scroll">
            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-xl text-left">
              <p className="text-xs text-slate-400 uppercase">Weight</p>
              <p className="text-2xl font-bold text-white">1.5 - 2.0 Kg</p>
            </div>
          </div>

          {/* Main Image */}
          <div className="relative w-[300px] md:w-[500px] aspect-square product-floating-img z-10">
            <Image
              src="https://images.unsplash.com/photo-1571575173700-afb9492e6a50?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Golden Apollo Premium"
              fill
              className="object-contain drop-shadow-[0_30px_60px_rgba(234,179,8,0.2)]"
            />
          </div>
        </div>

        <div className="text-center mt-10 reveal-on-scroll">
          <Link href="/products">
            <button className="px-10 py-4 border border-yellow-500/50 text-yellow-400 rounded-full font-bold hover:bg-yellow-500 hover:text-black transition-all">
              Lihat Spesifikasi Lengkap
            </button>
          </Link>
        </div>
      </section>

      {/* =========================================
          4. B2B SUPPLY CHAIN & FORECAST
         ========================================= */}
      <section className="py-32 px-6 bg-[#050505] relative border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div className="reveal-on-scroll">
            <h2 className="text-4xl font-bold mb-6">Supply Chain yang <span className="text-emerald-400">Dapat Diprediksi.</span></h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Untuk industri, kepastian adalah segalanya. Dengan sistem smart farming, kami dapat memprediksi volume panen hingga 3 bulan ke depan dengan akurasi 95%. Amankan stok Anda sekarang.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex-1">
                  <h4 className="font-bold text-white text-lg">Contract Farming</h4>
                  <p className="text-sm text-slate-500 mt-1">Harga tetap & volume terjamin untuk kontrak jangka panjang.</p>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex-1">
                  <h4 className="font-bold text-white text-lg">Custom Packaging</h4>
                  <p className="text-sm text-slate-500 mt-1">Labeling & kemasan sesuai brand supermarket/hotel Anda.</p>
                </div>
              </div>
              <Link href="/contact" className="inline-block">
                <button className="flex items-center gap-2 text-white border-b border-emerald-500 pb-1 hover:text-emerald-400 transition">
                  Hubungi Tim B2B <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/10 reveal-on-scroll">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold flex items-center gap-2"><TrendingUp size={20} className="text-emerald-400" /> Forecast Panen (Ton)</h3>
              <div className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">Q3 2024</div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={HARVEST_PREDICTION}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip
                    cursor={{ fill: '#1e293b' }}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  />
                  <Bar dataKey="output" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-center text-slate-500 mt-4">*Data estimasi berdasarkan siklus tanam saat ini.</p>
          </div>

        </div>
      </section>


      {/* =========================================
          5. ECOSYSTEM BENTO GRID (IMPROVED CONTENT)
         ========================================= */}
      <section className="py-32 px-6 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal-on-scroll">
            <h2 className="text-3xl font-bold mb-4">Ekosistem Terintegrasi</h2>
            <p className="text-slate-400">Lebih dari sekadar perkebunan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[500px]">
            {/* Education */}
            <Link href="/services/agro-education" className="group relative col-span-1 md:col-span-1 bg-gradient-to-br from-emerald-900/20 to-slate-900 rounded-3xl p-8 border border-white/5 hover:border-emerald-500/50 transition-all overflow-hidden reveal-on-scroll flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition"><ArrowRight className="-rotate-45 group-hover:rotate-0 transition duration-300" /></div>
              <div>
                <GraduationCap size={40} className="text-emerald-400 mb-6" />
                <h3 className="text-2xl font-bold mb-2">Academy</h3>
                <p className="text-slate-400 text-sm mb-4">Belajar metode smart farming langsung dari ahli.</p>
              </div>

              <div className="grid grid-cols-1 gap-2 mt-auto">
                <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 p-2 rounded border border-white/5">
                  <CheckCircle size={12} className="text-emerald-500" /> Sertifikasi Resmi
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 p-2 rounded border border-white/5">
                  <CheckCircle size={12} className="text-emerald-500" /> Mentor Ahli
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 p-2 rounded border border-white/5">
                  <CheckCircle size={12} className="text-emerald-500" /> Modul Praktis
                </div>
              </div>
            </Link>

            {/* AI Tools */}
            <Link href="/tools/iot-dashboard" className="group relative col-span-1 md:col-span-1 bg-gradient-to-br from-cyan-900/20 to-slate-900 rounded-3xl p-8 border border-white/5 hover:border-cyan-500/50 transition-all overflow-hidden reveal-on-scroll flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition"><ArrowRight className="-rotate-45 group-hover:rotate-0 transition duration-300" /></div>
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Smartphone size={40} className="text-cyan-400" />
                  <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded text-xs font-mono border border-cyan-500/30">Live Demo</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Smart IoT Control</h3>
                <p className="text-slate-400 text-sm mb-4">Monitoring sensor & kontrol perangkat greenhouse dari HP.</p>
              </div>

              <div className="flex flex-wrap gap-2 mt-auto">
                <span className="text-[10px] bg-cyan-500/10 text-cyan-200 px-2 py-1 rounded border border-cyan-500/20">Realtime Data</span>
                <span className="text-[10px] bg-cyan-500/10 text-cyan-200 px-2 py-1 rounded border border-cyan-500/20">Auto Pilot</span>
                <span className="text-[10px] bg-cyan-500/10 text-cyan-200 px-2 py-1 rounded border border-cyan-500/20">Alert System</span>
              </div>
            </Link>

            {/* Construction */}
            <Link href="/services/greenhouse-construction" className="group relative col-span-1 md:col-span-1 bg-gradient-to-br from-blue-900/20 to-slate-900 rounded-3xl p-8 border border-white/5 hover:border-blue-500/50 transition-all overflow-hidden reveal-on-scroll flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition"><ArrowRight className="-rotate-45 group-hover:rotate-0 transition duration-300" /></div>
              <div>
                <Sprout size={40} className="text-blue-400 mb-6" />
                <h3 className="text-2xl font-bold mb-2">Construction</h3>
                <p className="text-slate-400 text-sm mb-4">Jasa pembangunan greenhouse standar industri.</p>
              </div>

              <div className="space-y-2 mt-auto">
                <div className="flex justify-between text-xs text-slate-400 border-b border-white/5 pb-1">
                  <span>Material</span> <span className="text-white">Galvanis</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 border-b border-white/5 pb-1">
                  <span>Garansi</span> <span className="text-white">10 Tahun</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 border-b border-white/5 pb-1">
                  <span>Plastik UV</span> <span className="text-white">Import</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}