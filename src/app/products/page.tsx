'use client';

import Navbar from '@/components/Navbar';
import WholesaleCard from '@/components/b2b/wholeSaleCard';
import ProcurementAI from '@/components/b2b/ProcurementAI';
import { useState } from 'react';
import { Filter, ChevronDown, TrendingUp, Calendar, Package, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PRICE_DATA = [
    { name: 'Week 1', price: 12.5 },
    { name: 'Week 2', price: 12.8 },
    { name: 'Week 3', price: 13.0 },
    { name: 'Week 4', price: 12.9 },
    { name: 'Week 5', price: 13.2 }, 
];

const PRODUCTS = [
    {
        id: 1,
        name: "Golden Apollo Premium",
        grade: "AA",
        brix: "14-16",
        moq: 1000,
        price_ton: 13500000,
        capacity_week: 8,
        lead_time: "3 Hari",
        image_url: "https://images.unsplash.com/photo-1571575173700-afb9492e6a50?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVsb258ZW58MHx8MHx8fDA%3D",
        seasonality: "Stabil (IoT)"
    },
    {
        id: 2,
        name: "Inthanon Royal Net",
        grade: "A",
        brix: "13-15",
        moq: 500,
        price_ton: 15000000,
        capacity_week: 5,
        lead_time: "5 Hari",
        image_url: "https://images.unsplash.com/photo-1661193320145-2252cbfa7755?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWVsb258ZW58MHx8MHx8fDA%3D",
        seasonality: "High Demand"
    },
    {
        id: 3,
        name: "Sweet Net",
        grade: "A",
        brix: "12-14",
        moq: 1500,
        price_ton: 10000000,
        capacity_week: 4,
        lead_time: "4 Hari",
        image_url: "https://images.unsplash.com/photo-1563288525-8f1ee0f874a8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVsb258ZW58MHx8MHx8fDA%3D",
        seasonality: "High Demand"
    },
    
];

export default function WholesaleCatalog() {
    return (
        <main className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
            <Navbar />

            {/* DASHBOARD HEADER */}
            <div className="pt-28 pb-8 px-6 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8">
                        <div>
                            <span className="bg-slate-900 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2 inline-block">B2B Wholesale Portal</span>
                            <h1 className="text-3xl font-extrabold text-slate-900">Ketersediaan & Harga Pasar</h1>
                            <p className="text-slate-500 mt-1 text-sm">Update Real-time dari Greenhouse Central Melon (Blitar HQ)</p>
                        </div>
                        <div className="flex gap-3 mt-4 md:mt-0">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-gray-50">
                                <Download size={16} /> Download Price List
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100">
                                Login Supplier Portal
                            </button>
                        </div>
                    </div>

                    {/* DASHBOARD WIDGETS */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* WIDGET 1: Price Trend */}
                        <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase">Market Price Trend (IDR/Kg)</p>
                                    <h3 className="text-2xl font-black text-slate-900">Rp 13.200 <span className="text-emerald-500 text-sm font-medium">+2.1%</span></h3>
                                </div>
                                <TrendingUp className="text-emerald-500" />
                            </div>
                            <div className="h-24 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={PRICE_DATA}>
                                        <defs>
                                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Tooltip />
                                        <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* WIDGET 2: Supply Forecast */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Calendar size={20} /></div>
                                <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded">SAFE</span>
                            </div>
                            <p className="text-xs text-slate-400 font-bold uppercase">Forecast Panen (4 Minggu)</p>
                            <h3 className="text-3xl font-black text-slate-900 mt-1">42 <span className="text-sm font-normal text-slate-500">Ton</span></h3>
                            <p className="text-xs text-slate-500 mt-2">Cukup untuk memenuhi 120% kontrak berjalan.</p>
                        </div>

                        {/* WIDGET 3: Active Contracts */}
                        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm text-white">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-slate-800 text-emerald-400 rounded-lg"><Package size={20} /></div>
                            </div>
                            <p className="text-xs text-slate-400 font-bold uppercase">Slot Kontrak Tersedia</p>
                            <h3 className="text-3xl font-black text-white mt-1">3 <span className="text-sm font-normal text-slate-400">Partners</span></h3>
                            <button className="mt-4 w-full py-2 bg-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-500 transition">
                                Amankan Slot Supply
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CATALOG GRID */}
            <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-8">

                {/* LEFT SIDEBAR (FILTERS) */}
                <div className="w-full md:w-64 shrink-0 space-y-8">
                    <div>
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Filter size={18} /> Filter Spesifikasi</h3>

                        {/* Grade Filter */}
                        <div className="mb-6">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Grade Class</p>
                            <label className="flex items-center gap-3 mb-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" defaultChecked />
                                <span className="text-sm text-slate-700">Premium (AA)</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" defaultChecked />
                                <span className="text-sm text-slate-700">Standard (A)</span>
                            </label>
                        </div>

                        {/* MOQ Slider (Simulasi) */}
                        <div className="mb-6">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Min. Order (Ton)</p>
                            <input type="range" min="1" max="10" className="w-full accent-emerald-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>1 Ton</span>
                                <span>10 Ton</span>
                            </div>
                        </div>

                        {/* Varietas */}
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Varietas</p>
                            <div className="flex flex-wrap gap-2">
                                {['Net Melon', 'Smooth Skin', 'Orange Flesh', 'Green Flesh'].map(v => (
                                    <span key={v} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-slate-600 cursor-pointer hover:border-emerald-500 hover:text-emerald-600 transition">
                                        {v}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT CONTENT (PRODUCT GRID) */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-sm text-slate-500">Menampilkan <span className="font-bold text-slate-900">{PRODUCTS.length} Varietas</span> Grosir</p>
                        <button className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:border-emerald-500 transition">
                            Urutkan: Popularitas <ChevronDown size={14} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {PRODUCTS.map(product => (
                            <WholesaleCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>

            </div>

            {/* AI Assistant Floating Button */}
            <ProcurementAI />

        </main>
    );
}