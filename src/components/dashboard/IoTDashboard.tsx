'use client';

import { useState, useEffect } from 'react';
import {
    Thermometer, Droplets, Sun, Zap, Wind, Sprout,
    Activity, Cpu, RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import RealHardwareControl from './RealHardwareControl';

// --- TIPE DATA ---
type SensorData = {
    time: string;
    temp: number;
    humidity: number;
    soil: number;
    light: number;
    ec: number;
    ph: number;
};

export default function IoTDashboard() {
    // --- STATE SIMULATOR ---
    const [isDay, setIsDay] = useState(true); // Toggle Demo Siang/Malam
    const [history, setHistory] = useState<SensorData[]>([]);
    const [sensors, setSensors] = useState({
        temp: 29.0,
        humidity: 70.0,
        soil: 60.0,
        light: 25000,
        ec: 1.8,
        ph: 6.2
    });

    // --- STATE DEVICES (RULE ENGINE) ---
    const [devices, setDevices] = useState({
        fan: false,
        pump: false,
        shading: false,
        valve: false
    });

    // --- STATE AI ---
    const [aiAnalysis, setAiAnalysis] = useState("Menunggu data sensor stabil untuk analisis...");
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // --- 1. SENSOR SIMULATOR ENGINE ---
    useEffect(() => {
        const interval = setInterval(() => {
            setSensors(prev => {
                // Logika Random Walk (Smooth Shifting)
                const targetTemp = isDay ? 33 : 24;
                const targetLight = isDay ? 45000 : 0;

                // Rumus: Nilai Lama + (Arah ke Target * 0.1) + (Random Noise)
                let newTemp = prev.temp + (targetTemp - prev.temp) * 0.05 + (Math.random() - 0.5) * 0.5;
                let newLight = prev.light + (targetLight - prev.light) * 0.05 + (Math.random() - 0.5) * 500;

                // Soil moisture turun pelan-pelan (penguapan), naik drastis kalau pompa nyala
                let newSoil = prev.soil - 0.1;
                if (devices.pump) newSoil += 2.0; // Pompa effect

                // Humidity berbanding terbalik dengan suhu
                let newHumid = 100 - (newTemp * 1.5) + (Math.random() - 0.5) * 2;

                // Anomali Random (1% chance)
                if (Math.random() > 0.99) newTemp += 3;

                return {
                    temp: Math.max(15, Math.min(45, newTemp)),
                    humidity: Math.max(30, Math.min(95, newHumid)),
                    soil: Math.max(0, Math.min(100, newSoil)),
                    light: Math.max(0, newLight),
                    ec: prev.ec + (Math.random() - 0.5) * 0.05,
                    ph: prev.ph + (Math.random() - 0.5) * 0.05
                };
            });
        }, 2000); // Update tiap 2 detik

        return () => clearInterval(interval);
    }, [isDay, devices.pump]);

    // --- 2. RULE ENGINE (OTOMASI) ---
    useEffect(() => {
        const fanStatus = sensors.temp > 32;
        const pumpStatus = sensors.soil < 40;
        const shadingStatus = sensors.light > 40000;
        const valveStatus = sensors.ec < 1.5;

        setDevices({
            fan: fanStatus,
            pump: pumpStatus,
            shading: shadingStatus,
            valve: valveStatus
        });

        // Update History Grafik
        setHistory(prev => {
            const newData = { ...sensors, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) };
            const newHist = [...prev, newData];
            if (newHist.length > 20) newHist.shift(); // Keep last 20 data points
            return newHist;
        });

    }, [sensors]);

    // --- 3. AI ANALYZER TRIGGER ---
    useEffect(() => {
        const triggerAI = async () => {
            setIsAnalyzing(true);
            try {
                const res = await fetch('/api/iot-analyze', {
                    method: 'POST',
                    body: JSON.stringify({ sensors, devices })
                });
                const data = await res.json();
                if (data.analysis) setAiAnalysis(data.analysis);
            } catch (e) {
                console.error("AI Error");
            } finally {
                setIsAnalyzing(false);
            }
        };

        const aiInterval = setInterval(triggerAI, 15000);
        return () => clearInterval(aiInterval);
    }, [isDay]);

    return (
        <div className="space-y-8">

            {/* --- 1. REAL HARDWARE SECTION --- */}
            <RealHardwareControl />

            {/* DIVIDER */}
            <div className="flex items-center gap-4">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider px-2">Atau Gunakan Simulasi Data</span>
                <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            {/* --- 2. SIMULATOR SECTION --- */}
            <div className="space-y-6">
                {/* HEADER CONTROL */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900 text-white p-6 rounded-3xl shadow-lg border border-slate-700">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            <h2 className="text-lg font-bold">Simulasi Monitoring</h2>
                        </div>
                        <p className="text-slate-400 text-sm">Greenhouse A - Golden Apollo</p>
                    </div>

                    {/* DEMO CONTROLS */}
                    <div className="flex items-center gap-4 bg-slate-800 p-2 rounded-xl mt-4 md:mt-0">
                        <span className="text-xs font-bold text-slate-400 uppercase ml-2">Mode:</span>
                        <button
                            onClick={() => setIsDay(true)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${isDay ? 'bg-yellow-500 text-black' : 'text-slate-400 hover:bg-slate-700'}`}
                        >
                            <Sun size={16} /> Siang
                        </button>
                        <button
                            onClick={() => setIsDay(false)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${!isDay ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
                        >
                            <Wind size={16} /> Malam
                        </button>
                    </div>
                </div>

                {/* SENSOR GRID */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                        { label: 'Suhu Udara', val: sensors.temp.toFixed(1), unit: '°C', icon: Thermometer, color: 'text-red-500', bg: 'bg-red-500/10' },
                        { label: 'Kelembapan', val: sensors.humidity.toFixed(0), unit: '%', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                        { label: 'Soil Moisture', val: sensors.soil.toFixed(0), unit: '%', icon: Sprout, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                        { label: 'Intensitas Cahaya', val: sensors.light.toFixed(0), unit: 'Lux', icon: Sun, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                        { label: 'Nutrisi (EC)', val: sensors.ec.toFixed(1), unit: 'mS', icon: Zap, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                        { label: 'pH Air', val: sensors.ph.toFixed(1), unit: 'pH', icon: Activity, color: 'text-teal-500', bg: 'bg-teal-500/10' },
                    ].map((s, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center hover:scale-105 transition duration-300">
                            <div className={`p-3 rounded-full ${s.bg} ${s.color} mb-2`}>
                                <s.icon size={20} />
                            </div>
                            <p className="text-xs text-gray-400 font-bold uppercase">{s.label}</p>
                            <p className="text-2xl font-black text-slate-800">{s.val}<span className="text-xs text-gray-400 font-normal ml-1">{s.unit}</span></p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT: REALTIME CHART */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-[400px]">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Activity className="text-emerald-600" /> Grafik Realtime (Suhu & Kelembapan)
                        </h3>
                        <ResponsiveContainer width="100%" height="90%">
                            <LineChart data={history}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                <XAxis dataKey="time" fontSize={10} tick={{ fill: '#94a3b8' }} />
                                <YAxis fontSize={10} tick={{ fill: '#94a3b8' }} domain={[0, 100]} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Line type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={3} dot={false} name="Suhu (°C)" />
                                <Line type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={3} dot={false} name="Kelembapan (%)" />
                                <Line type="monotone" dataKey="soil" stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="5 5" name="Soil (%)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* RIGHT: CONTROL & AI */}
                    <div className="space-y-6">

                        {/* DEVICE STATUS (RULE ENGINE VISUALIZER) */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Cpu className="text-blue-600" /> Otomasi Perangkat
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { name: 'Exhaust Fan', on: devices.fan, rule: '> 32°C' },
                                    { name: 'Drip Pump', on: devices.pump, rule: '< 40% Soil' },
                                    { name: 'Shading Net', on: devices.shading, rule: '> 40k Lux' },
                                    { name: 'Nutrient Valve', on: devices.valve, rule: '< 1.5 EC' },
                                ].map((d, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="font-bold text-slate-700 text-sm">{d.name}</p>
                                            <p className="text-[10px] text-gray-400">Trigger: {d.rule}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${d.on ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-gray-200 text-gray-400'
                                            }`}>
                                            {d.on ? 'ON' : 'OFF'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI INSIGHT */}
                        <div className="bg-linear-to-br from-indigo-900 to-slate-900 p-6 rounded-3xl text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                            <div className="relative z-10">
                                <h3 className="font-bold mb-2 flex items-center gap-2 text-indigo-300">
                                    ✨ AI Agronomist Analysis
                                </h3>
                                <div className="min-h-[100px] text-sm leading-relaxed text-indigo-100/90 font-light">
                                    {isAnalyzing ? (
                                        <div className="flex items-center gap-2 animate-pulse">
                                            <RefreshCw className="animate-spin" size={16} /> Menganalisis data sensor...
                                        </div>
                                    ) : (
                                        aiAnalysis
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}