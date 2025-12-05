import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/dashboard/Sidebar';
import InventoryManager from '@/components/dashboard/InventoryManager';
import SalesChart from '@/components/charts/SalesChart';
import QualityChart from '@/components/charts/QualityChart';
import LogisticsGraph from '@/components/charts/LogisticsGraph';
import UserNav from '@/components/UserNav';
import POSSystem from '@/components/dashboard/POSSystem';
import SalesReport from '@/components/dashboard/SalesReport';
import SettingsView from '@/components/dashboard/SettingsView';
import { Truck, TrendingUp, Activity, ScanLine, Search, Bell, Settings, Microscope } from 'lucide-react';
import { calculateRegression } from '@/core/math/regression';
import { simulateMelonQuality } from '@/core/math/rungeKutta';
import { findShortestPath } from '@/core/graph/logistics';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
   
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll(cookiesToSet) { try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch { } },
            },
        }
    );

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) redirect('/login');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') redirect('/');

    const { data: salesDB } = await supabase.from('sales_data').select('*').order('month_index', { ascending: true });
    const formattedSales = salesDB?.map((item: any) => ({ month: item.month_index, sales: item.total_sales })) || [];
    const regression = formattedSales.length > 0 ? calculateRegression(formattedSales) : { prediction: 0, slope: 0, intercept: 0, formula: "No Data" };
    const qualityData = simulateMelonQuality(100, 7, 0.15);
    const logisticsGraph = {
        "Kebun A": { "Gudang Pusat": 10, "Pasar Lokal": 50 },
        "Gudang Pusat": { "Pasar Kota": 20, "Bandara": 40 },
        "Pasar Lokal": { "Pasar Kota": 30 },
        "Pasar Kota": { "Konsumen": 10 },
        "Bandara": { "Konsumen": 5 },
    };
    const routeResult = findShortestPath(logisticsGraph, "Kebun A", "Konsumen");

    const params = await searchParams;
    const currentView = typeof params.view === 'string' ? params.view : 'overview';

    return (
        <div className="min-h-screen bg-[#f3f4f6] flex">
            {/* --- SIDEBAR (KIRI) --- */}
            <Sidebar />

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 ml-64 min-w-0">

                {/* TOP HEADER BAR */}
                <header className="bg-white px-8 py-4 flex justify-between items-center sticky top-0 z-40 border-b border-gray-200 shadow-sm">
                    {/* Search Bar Modern */}
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari data panen, stok, atau laporan..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 focus:bg-white transition outline-none text-slate-700"
                        />
                    </div>

                    {/* Right Side Icons */}
                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-gray-400 hover:text-emerald-600 transition bg-gray-50 hover:bg-emerald-50 rounded-full">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-gray-200"></div>
                        <UserNav /> {/* Profil Admin */}
                    </div>
                </header>

                {/* DYNAMIC CONTENT AREA */}
                <div className="p-8">

                    {/* ---------------- VIEW: OVERVIEW ---------------- */}
                    {currentView === 'overview' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Header Text */}
                            <div className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
                                    <p className="text-gray-500 mt-1">Ringkasan performa kebun dan logistik hari ini.</p>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Card 1: Penjualan */}
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition flex items-center justify-between group">
                                    <div>
                                        <p className="text-sm font-medium text-gray-400 mb-1 group-hover:text-emerald-600 transition">Total Penjualan</p>
                                        <h3 className="text-3xl font-bold text-slate-800">1,240</h3>
                                        <p className="text-xs text-emerald-500 font-bold mt-2 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-full w-fit">
                                            <TrendingUp size={12} /> +12% bulan ini
                                        </p>
                                    </div>
                                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition duration-300">
                                        <Activity size={28} />
                                    </div>
                                </div>

                                {/* Kualitas */}
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition flex items-center justify-between group">
                                    <div>
                                        <p className="text-sm font-medium text-gray-400 mb-1 group-hover:text-emerald-600 transition">Rata-rata Kualitas (Brix)</p>
                                        <h3 className="text-3xl font-bold text-slate-800">14.2%</h3>
                                        <p className="text-xs text-emerald-500 font-bold mt-2 bg-emerald-50 px-2 py-1 rounded-full w-fit">Grade A (Premium)</p>
                                    </div>
                                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition duration-300">
                                        <TrendingUp size={28} />
                                    </div>
                                </div>

                                {/* Prediksi Panen */}
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition flex items-center justify-between group">
                                    <div>
                                        <p className="text-sm font-medium text-gray-400 mb-1 group-hover:text-emerald-600 transition">Prediksi Panen</p>
                                        <h3 className="text-3xl font-bold text-slate-800">{regression.prediction}</h3>
                                        <p className="text-xs text-gray-400 mt-2">Unit bulan depan</p>
                                    </div>
                                    <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition duration-300">
                                        <Truck size={28} />
                                    </div>
                                </div>
                            </div>

                            {/* Charts Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* PASSING DATA KE KOMPONEN BARU */}
                                <SalesChart
                                    historical={formattedSales}
                                    prediction={regression}
                                />

                                <LogisticsGraph route={routeResult?.path || []} />
                            </div>
                        </div>
                    )}

                    {/* ---------------- INVENTORY ---------------- */}
                    {currentView === 'inventory' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Manajemen Stok & Produk</h2>
                                <p className="text-gray-500 mt-1">Kelola ketersediaan barang dan update katalog secara real-time.</p>
                            </div>
                            <InventoryManager />
                        </div>
                    )}

                    {/* ---------------- KASIR (POS) ---------------- */}
                    {currentView === 'pos' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-800">Kasir / Point of Sale</h2>
                                <p className="text-gray-500 mt-1">Kelola transaksi pembelian offline secara langsung.</p>
                            </div>
                            <POSSystem />
                        </div>
                    )}

                    {/* ---------------- LAPORAN PENJUALAN ---------------- */}
                    {currentView === 'report' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-800">Laporan Penjualan</h2>
                                <p className="text-gray-500 mt-1">Rekapitulasi omset dan riwayat transaksi.</p>
                            </div>
                            <SalesReport />
                        </div>
                    )}

                    {/* ---------------- ANALISIS KUALITAS ---------------- */}
                    {currentView === 'analytics' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">Analisis Kualitas AI</h2>
                                    <p className="text-gray-500 mt-1">Deteksi penyakit dan kualitas melon menggunakan Computer Vision.</p>
                                </div>
                                <Link href="/dashboard/scan">
                                    <button className="flex items-center gap-2 bg-[#0f172a] text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 active:scale-95 transform">
                                        <ScanLine size={18} />
                                        <span>Buka Scanner Fullscreen</span>
                                    </button>
                                </Link>
                            </div>

                            {/* AREA SIMULASI KUALITAS */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Grafik Simulasi Penurunan Kualitas */}
                                <div className="lg:col-span-2">
                                    <QualityChart simulationData={qualityData} />
                                </div>

                                {/* Panel Informasi AI */}
                                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                                            <Microscope size={20} />
                                        </div>
                                        <h3 className="font-bold text-slate-800">Diagnosa Terakhir</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <p className="text-xs text-gray-400 mb-1">Status Sampel</p>
                                            <p className="font-bold text-green-600">Sehat (Grade A)</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <p className="text-xs text-gray-400 mb-1">Estimasi Brix</p>
                                            <p className="font-bold text-slate-800">14.5%</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <p className="text-xs text-gray-400 mb-1">Rekomendasi</p>
                                            <p className="text-sm text-slate-600">Siap panen dalam 2 hari untuk kemanisan optimal.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ---------------- PENGATURAN ---------------- */}
                    {currentView === 'settings' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <SettingsView />
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}