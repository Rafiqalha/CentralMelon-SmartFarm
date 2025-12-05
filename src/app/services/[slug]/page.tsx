'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    ArrowLeft, CheckCircle, Hammer, ShieldCheck,
    MessageSquare, Cpu, Wifi, Activity, Zap,
    Smartphone, Cloud, ArrowRight, Play,
    BookOpen, GraduationCap, Users, FileText, Star,
    Ruler, Maximize, PenTool, LayoutTemplate, Sprout
} from 'lucide-react';
import { use } from 'react';

const SERVICE_CONTENT: any = {
    'greenhouse-construction': {
        title: 'Precision Environment Engineering',
        subtitle: 'Konstruksi Greenhouse modern untuk hasil panen yang konsisten, bebas hama, dan iklim terkontrol.',
        description: 'Kami tidak sekadar membangun atap. Kami merancang ekosistem. Greenhouse kami didesain menggunakan simulasi aerodinamika untuk memaksimalkan sirkulasi udara alami dan meminimalkan suhu panas ekstrem (Heat Stress).',
        features: ['Rangka Galvanis Anti-Karat (Garansi 10 Tahun)', 'Plastik UV 14% Import (Vatani/Toyatani)', 'Insect Net 50 Mesh (Anti Kutu Kebul)', 'Sistem Irigasi Tetes Terintegrasi', 'Lantai Ground Cover & Meja Tanam'],
        specs: [
            { label: 'Lebar Bentang', value: '6 - 8 Meter' },
            { label: 'Tinggi Top Chord', value: '4.5 - 5 Meter' },
            { label: 'Jarak Antar Tiang', value: '2 - 3 Meter' },
            { label: 'Ketahanan Angin', value: 'Hingga 80 km/jam' },
        ],
        image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1932&auto=format&fit=crop'
    },
    'iot-installation': {
        title: 'IoT Smart Farming System',
        subtitle: 'Otomatisasi kebun presisi dalam genggaman smartphone.',
        description: 'Transformasi kebun konvensional menjadi Smart Farm berbasis data. Sistem kami memantau mikroklimat (suhu, kelembapan, VPD) dan mengontrol irigasi secara otomatis berdasarkan kebutuhan tanaman real-time.',
        features: ['Real-time Dashboard (Mobile/Web)', 'Sensor Presisi Tinggi (Industrial Grade)', 'Auto-Fertigation Control', 'Alert System (WhatsApp Notif)', 'Historical Data Analytics'],
        specs: [
            { label: 'Controller Brain', value: 'ESP32 Dual Core' },
            { label: 'Connectivity', value: 'WiFi / 4G LTE' },
            { label: 'Sensor Accuracy', value: '±0.5°C / ±2% RH' },
            { label: 'Cloud Server', value: 'Central Melon Cloud' },
        ],
        image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=2070&auto=format&fit=crop'
    },
    'agro-education': {
        title: 'Melon Masterclass Academy',
        subtitle: 'Dari pemula menjadi petani melon premium bersertifikat.',
        description: 'Bukan sekadar teori. Ini adalah program mentoring intensif yang membuka rahasia dapur Central Melon. Pelajari racikan nutrisi rahasia, teknik pruning, hingga strategi pasar B2B.',
        features: ['Modul Lengkap (PDF & Video)', 'Praktek Langsung di GH', 'Konsultasi Eksklusif', 'Analisis ROI', 'Sertifikat'],
        specs: [
            { label: 'Durasi', value: '3 Hari (Intensif)' },
            { label: 'Materi', value: 'Hulu ke Hilir' },
            { label: 'Lokasi', value: 'Blitar / Online' },
            { label: 'Kuota', value: 'Max 10 Orang' },
        ],
        image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop'
    }
};

export default function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const data = SERVICE_CONTENT[slug];

    if (!data) return notFound();

    if (slug === 'iot-installation') {
        return (
            <main className="min-h-screen bg-[#0b1120] text-white overflow-hidden font-sans selection:bg-cyan-500 selection:text-white">
                <Navbar />

                {/* Background Effects */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px]"></div>
                </div>

                <div className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
                    {/* Header Breadcrumb */}
                    <Link href="/services" className="inline-flex items-center gap-2 text-cyan-400 font-bold mb-8 hover:text-cyan-300 transition text-sm uppercase tracking-wider">
                        <ArrowLeft size={16} /> Kembali ke Layanan
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
                        {/* Hero Text */}
                        <div className="animate-in fade-in slide-in-from-left-8 duration-700">
                            <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-full px-4 py-1 mb-6">
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                                <span className="text-xs font-bold text-cyan-300 uppercase">IoT System v2.0 Live</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight bg-clip-text text-transparent bg-linear-to-r from-white via-cyan-100 to-slate-400">
                                Smart Farming <br /> Automation
                            </h1>
                            <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
                                Tinggalkan cara lama. Biarkan algoritma cerdas kami menjaga nutrisi, suhu, dan kelembapan tanaman Anda 24/7 dengan presisi milidetik.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/tools/iot-dashboard">
                                    <button className="w-full sm:w-auto px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(8,145,178,0.3)] transition flex items-center justify-center gap-3 group">
                                        <Play size={20} fill="currentColor" /> Live Simulator
                                    </button>
                                </Link>
                                <a href="https://wa.me/6285709477872" target="_blank" className="w-full sm:w-auto px-8 py-4 bg-slate-800 border border-slate-700 text-white font-bold rounded-xl hover:bg-slate-700 transition flex items-center justify-center gap-2">
                                    <MessageSquare size={20} /> Konsultasi Ahli
                                </a>
                            </div>
                        </div>

                        {/* Hero Visual */}
                        <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                            <div className="absolute inset-0 bg-linear-to-tr from-cyan-500 to-blue-600 rounded-4xl blur-2xl opacity-20"></div>
                            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 p-8 rounded-4xl relative overflow-hidden">
                                {/* Decorative UI Elements */}
                                <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold">System Status</p>
                                        <p className="text-emerald-400 font-bold flex items-center gap-2">● Online & Monitoring</p>
                                    </div>
                                    <Cpu className="text-slate-600" size={32} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Temp', val: '29°C', icon: Activity, col: 'text-orange-400' },
                                        { label: 'Humidity', val: '75%', icon: Cloud, col: 'text-blue-400' },
                                        { label: 'Soil Moisture', val: '60%', icon: Zap, col: 'text-emerald-400' },
                                        { label: 'Device', val: 'Active', icon: Wifi, col: 'text-purple-400' },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                            <div className="flex justify-between items-start mb-2">
                                                <stat.icon size={18} className={stat.col} />
                                                <span className="text-[10px] text-slate-500">LIVE</span>
                                            </div>
                                            <p className="text-2xl font-bold text-white">{stat.val}</p>
                                            <p className="text-xs text-slate-400">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                        {[
                            { title: 'Real-time Monitoring', desc: 'Pantau kebun dari mana saja via smartphone.', icon: Smartphone },
                            { title: 'Automated Control', desc: 'Pompa & kipas menyala otomatis sesuai sensor.', icon: Cpu },
                            { title: 'Data Analytics', desc: 'Laporan grafik harian untuk evaluasi tanam.', icon: Activity },
                        ].map((feat, idx) => (
                            <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-cyan-500/50 transition duration-300 group">
                                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition">
                                    <feat.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-white">{feat.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Tech Specs Table */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-4xl mx-auto">
                        <h3 className="text-2xl font-bold mb-6 text-center">Spesifikasi Hardware</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                            {data.specs.map((spec: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center border-b border-slate-800 pb-3">
                                    <span className="text-slate-400">{spec.label}</span>
                                    <span className="font-mono text-cyan-300 font-bold">{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        );
    }

    if (slug === 'agro-education') {
        return (
            <main className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-emerald-200">
                <Navbar />

                {/* Header / Hero Section */}
                <div className="relative pt-32 pb-20 px-6 bg-linear-to-b from-emerald-900 to-emerald-800 text-white overflow-hidden rounded-b-[3rem] shadow-2xl">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/20 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="animate-in slide-in-from-bottom-4 duration-700">
                            <Link href="/services" className="inline-flex items-center gap-2 text-emerald-200 font-bold mb-6 hover:text-white transition text-sm">
                                <ArrowLeft size={16} /> Kembali ke Layanan
                            </Link>
                            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                                Melon Masterclass <br /><span className="text-yellow-400">Academy</span>
                            </h1>
                            <p className="text-emerald-100 text-lg leading-relaxed mb-8 max-w-lg">
                                Program pelatihan pertanian modern paling komprehensif. Dari memilih benih hingga panen grade A, kami ajarkan semuanya.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/tools/agro-quiz">
                                    <button className="px-8 py-4 bg-white text-emerald-900 font-bold rounded-xl hover:scale-105 active:scale-95 transition shadow-xl flex items-center gap-2">
                                        <Play size={20} fill="currentColor" className="text-yellow-500" /> Coba Kuis Gratis
                                    </button>
                                </Link>
                                <div className="flex items-center gap-3 px-6 py-4 bg-emerald-800/50 rounded-xl border border-emerald-700/50 backdrop-blur-sm">
                                    <Users size={20} className="text-emerald-300" />
                                    <div>
                                        <p className="text-xs text-emerald-300 font-bold uppercase">Alumni</p>
                                        <p className="font-bold">500+ Petani</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Hero Image */}
                        <div className="relative hidden lg:block h-[500px]">
                            <div className="absolute inset-0 bg-white/10 rounded-4xl rotate-3 backdrop-blur-sm border border-white/10"></div>
                            <img
                                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
                                className="absolute inset-0 w-full h-full object-cover rounded-4xl shadow-2xl -rotate-2 hover:rotate-0 transition duration-500"
                                alt="Education"
                            />
                            {/* Floating Badge */}
                            <div className="absolute -bottom-6 -left-6 bg-white text-slate-900 p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce delay-700">
                                <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                                    <Star size={24} fill="currentColor" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg">4.9/5.0</p>
                                    <p className="text-xs text-slate-500">Rating Peserta</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-7xl mx-auto px-6 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* CURRICULUM */}
                        <div className="lg:col-span-2 space-y-12">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                    <BookOpen className="text-emerald-600" /> Kurikulum Pembelajaran
                                </h2>
                                <div className="space-y-6">
                                    {[
                                        { day: '01', title: 'Fundamental & Persiapan', desc: 'Pemilihan benih unggul, sterilisasi media tanam, dan instalasi irigasi.', color: 'bg-blue-50 text-blue-600' },
                                        { day: '02', title: 'Nutrisi & Perawatan', desc: 'Racikan AB Mix rahasia, teknik pruning (pangkas), dan polinasi buatan.', color: 'bg-emerald-50 text-emerald-600' },
                                        { day: '03', title: 'Panen & Bisnis', desc: 'Ciri buah matang sempurna, handling pasca panen, dan strategi masuk supermarket.', color: 'bg-yellow-50 text-yellow-600' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex gap-6 p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-lg transition-all group">
                                            <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center text-xl font-bold shrink-0 group-hover:scale-110 transition`}>
                                                {item.day}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                                                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Interactive Quiz Promo */}
                            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div>
                                        <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mb-3 inline-block">Fitur Baru</span>
                                        <h3 className="text-2xl font-bold mb-2">Uji Skill Agronomi Kamu</h3>
                                        <p className="text-slate-300 text-sm max-w-md">Sebelum mendaftar, coba tes pengetahuan dasar kamu dengan AI Quiz kami. Gratis!</p>
                                    </div>
                                    <Link href="/tools/agro-quiz">
                                        <button className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-emerald-50 transition shadow-lg flex items-center gap-2">
                                            Mainkan Sekarang <ArrowRight size={18} />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* DETAILS & CTA */}
                        <div className="space-y-8">
                            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-24">
                                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <GraduationCap className="text-emerald-600" /> Detail Program
                                </h3>

                                <div className="space-y-4 mb-8">
                                    {data.specs.map((spec: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center border-b border-gray-50 pb-3">
                                            <span className="text-slate-500 text-sm font-medium">{spec.label}</span>
                                            <span className="text-slate-900 font-bold text-right">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3">
                                    <p className="text-xs text-center text-gray-400 mb-2">Slot terbatas bulan ini!</p>
                                    <a
                                        href="https://wa.me/6285709477872?text=Halo%20Admin,%20saya%20tertarik%20daftar%20kelas%20Agro%20Education"
                                        target="_blank"
                                        className="block w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-center transition shadow-lg shadow-emerald-200 items-center justify-center gap-2"
                                    >
                                        <MessageSquare size={20} /> Daftar via WhatsApp
                                    </a>
                                    <button className="block w-full py-4 bg-white border border-gray-200 text-slate-700 font-bold rounded-xl text-center hover:bg-gray-50 transition items-center justify-center gap-2">
                                        <FileText size={18} /> Download Silabus PDF
                                    </button>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <p className="font-bold text-slate-800 text-sm mb-3">Fasilitas Peserta:</p>
                                    <ul className="space-y-2 text-sm text-slate-500">
                                        <li className="flex gap-2"><CheckCircle size={16} className="text-emerald-500" /> Makan Siang & Coffee Break</li>
                                        <li className="flex gap-2"><CheckCircle size={16} className="text-emerald-500" /> Modul Cetak Eksklusif</li>
                                        <li className="flex gap-2"><CheckCircle size={16} className="text-emerald-500" /> Benih Starter Pack</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
            <Navbar />

            {/* HERO SECTION: Industrial Look */}
            <div className="relative pt-32 pb-24 px-6 bg-slate-900 text-white overflow-hidden rounded-b-[4rem]">
                {/* Blueprint Grid Background */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <Link href="/services" className="inline-flex items-center gap-2 text-slate-400 font-bold mb-6 hover:text-white transition text-xs uppercase tracking-[0.2em]">
                            <ArrowLeft size={14} /> Back to Services
                        </Link>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
                            ENGINEERED <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-200">FOR GROWTH.</span>
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-xl border-l-2 border-emerald-500 pl-6">
                            {data.description}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/tools/greenhouse-designer">
                                <button className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-none skew-x-[-10deg] transition transform hover:-translate-y-1 flex items-center justify-center gap-2 group">
                                    <span className="skew-x-10 flex items-center gap-2">
                                        <PenTool size={20} /> Design Your Greenhouse
                                    </span>
                                </button>
                            </Link>
                            <button className="px-8 py-4 border border-slate-600 text-white font-bold rounded-none skew-x-[-10deg] hover:bg-white hover:text-slate-900 transition flex items-center justify-center gap-2">
                                <span className="skew-x-10 flex items-center gap-2">
                                    <FileText size={20} /> Download Blueprint
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Image with Blueprint Overlay */}
                    <div className="flex-1 relative w-full aspect-video lg:aspect-square max-h-[500px]">
                        <div className="absolute inset-0 border-2 border-dashed border-emerald-500/30 rounded-xl z-20"></div>
                        {/* Crosshairs */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-500 z-30"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-500 z-30"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-500 z-30"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-500 z-30"></div>

                        <img
                            src={data.image}
                            alt="Greenhouse Structure"
                            className="w-full h-full object-cover rounded-xl grayscale-50 hover:grayscale-0 transition duration-700"
                        />

                        {/* Floating Stat Card */}
                        <div className="absolute -bottom-6 -left-6 bg-white text-slate-900 p-6 shadow-2xl border-l-4 border-emerald-600 z-40 hidden md:block">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Wind Resistance</p>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-black">80</span>
                                <span className="text-sm font-bold mb-1">Km/h</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SPECS & FEATURES: Grid Layout */}
            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Structural Features */}
                    <div className="lg:col-span-7 space-y-8">
                        <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <Maximize className="text-emerald-600" /> Structural Integrity
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.features.map((feat: string, idx: number) => (
                                <div key={idx} className="flex items-start gap-4 p-4 bg-white border border-slate-200 hover:border-emerald-500 transition-colors group">
                                    <div className="mt-1 w-2 h-2 bg-slate-300 group-hover:bg-emerald-500 rounded-full"></div>
                                    <p className="text-slate-700 font-medium leading-snug">{feat}</p>
                                </div>
                            ))}
                        </div>

                        {/* AI TOOL PROMO (Secondary) */}
                        <div className="mt-12 bg-slate-900 text-white p-8 relative overflow-hidden group cursor-pointer hover:shadow-2xl transition-all">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/30 transition"></div>
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-2">
                                        <LayoutTemplate size={14} /> AI Architect Tool
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Belum punya desain lahan?</h3>
                                    <p className="text-slate-400 text-sm max-w-md">Gunakan AI kami untuk menghitung kebutuhan material dan layout bedengan secara otomatis.</p>
                                </div>
                                <Link href="/tools/greenhouse-designer">
                                    <div className="bg-white text-slate-900 p-4 rounded-full hover:scale-110 transition">
                                        <ArrowRight size={24} />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Technical Specs Table */}
                    <div className="lg:col-span-5">
                        <div className="bg-white border-2 border-slate-900 p-8 shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] sticky top-24">
                            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-wide">
                                <Ruler className="text-emerald-600" /> Technical Data
                            </h3>

                            <div className="space-y-0 divide-y divide-slate-100">
                                {data.specs.map((spec: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center py-4">
                                        <span className="text-slate-500 text-sm font-bold uppercase">{spec.label}</span>
                                        <span className="text-slate-900 font-mono font-bold">{spec.value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t-2 border-slate-900 border-dashed">
                                <p className="text-xs text-slate-500 mb-4 text-center">Butuh penawaran resmi (RAB)?</p>
                                <a
                                    href={`https://wa.me/6285709477872?text=Halo%20Central%20Melon,%20saya%20tertarik%20dengan%20konstruksi%20Greenhouse.`}
                                    target="_blank"
                                    className="block w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center transition uppercase tracking-wider"
                                >
                                    Request Quotation
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}