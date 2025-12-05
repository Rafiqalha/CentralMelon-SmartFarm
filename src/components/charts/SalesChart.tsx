'use client';

import { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ComposedChart
} from 'recharts';
import { supabase } from '@/lib/supabase';
import { calculateRegression } from '@/core/math/regression'; 
import { TrendingUp, RefreshCw, Wifi } from 'lucide-react';

interface SalesChartProps {
    historical: any[];
    prediction: any; 
}

export default function SalesChart({ historical: initialData }: SalesChartProps) {
    const [data, setData] = useState<any[]>(initialData);
    const [predictionData, setPredictionData] = useState<any>(null);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        if (data.length > 0) {
            const result = calculateRegression(data);
            setPredictionData(result);
        }
    }, [data]);

    const chartData = data.map((item, index) => {
        const predictedSales = predictionData
            ? (predictionData.slope * (index + 1)) + predictionData.intercept
            : 0;

        return {
            name: `Bulan ${item.month}`,
            actual: item.sales,
            predicted: Math.round(predictedSales), 
        };
    });

    if (predictionData && data.length > 0) {
        const nextMonthIndex = data.length + 1;
        const nextMonthPrediction = (predictionData.slope * nextMonthIndex) + predictionData.intercept;
        chartData.push({
            name: `Prediksi (Bln ${nextMonthIndex})`,
            actual: null as any,
            predicted: Math.round(nextMonthPrediction),
        });
    }

    useEffect(() => {
        const channel = supabase
            .channel('realtime-sales')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'sales_data' }, (payload) => {
                setIsLive(true);
                fetchLatestData();
                setTimeout(() => setIsLive(false), 2000);
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const fetchLatestData = async () => {
        const { data: newData } = await supabase
            .from('sales_data')
            .select('*')
            .order('month_index', { ascending: true });

        if (newData) {
            const formatted = newData.map((item: any) => ({
                month: item.month_index,
                sales: item.total_sales
            }));
            setData(formatted);
        }
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xl border border-slate-700">
                    <p className="text-sm font-bold mb-2 text-slate-300">{label}</p>
                    <div className="space-y-1">
                        {payload[0].value && (
                            <p className="text-sm text-emerald-400 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                Aktual: <span className="font-bold">{payload[0].value} Unit</span>
                            </p>
                        )}
                        <p className="text-sm text-red-300 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-400"></span>
                            Trend AI: <span className="font-bold">{payload[1]?.value} Unit</span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">
            {/* Header Grafik */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        Analisis Tren Penjualan
                        {isLive && <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Data real-time & prediksi regresi linear.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 transition-all ${isLive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        <Wifi size={14} className={isLive ? "animate-pulse" : ""} />
                        {isLive ? 'Live Update' : 'Connected'}
                    </span>
                </div>
            </div>

            {/* Area Grafik Responsif */}
            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />

                        {/* Garis Prediksi AI (Merah) */}
                        <Line
                            type="monotone"
                            dataKey="predicted"
                            stroke="#f87171"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={false}
                            activeDot={{ r: 6 }}
                            name="Prediksi AI"
                        />

                        {/* Area Penjualan Aktual (Hijau) */}
                        <Area
                            type="monotone"
                            dataKey="actual"
                            stroke="#10b981"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorSales)"
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            name="Penjualan"
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Footer Info */}
            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between text-sm">
                <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-emerald-500" />
                    <span className="text-gray-500">Pertumbuhan: </span>
                    <span className="font-bold text-slate-800">
                        {predictionData?.slope > 0 ? '+' : ''}{predictionData?.slope?.toFixed(2)} Unit/Bulan
                    </span>
                </div>
                <div className="text-gray-400 text-xs">
                    AI Model: Linear Regression v1.0
                </div>
            </div>
        </div>
    );
}