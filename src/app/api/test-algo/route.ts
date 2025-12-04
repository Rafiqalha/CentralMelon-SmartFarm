import { NextResponse } from 'next/server';
import { calculateRegression } from '@/core/math/regression';
import { simulateMelonQuality } from '@/core/math/rungeKutta';
import { findShortestPath } from '@/core/graph/logistics';

export async function GET() {
    // --- 1. TEST LINEAR REGRESSION (Prediksi Penjualan) ---
    // Data: Bulan 1-5, Penjualan naik turun
    const salesData = [
        { month: 1, sales: 120 },
        { month: 2, sales: 135 },
        { month: 3, sales: 130 },
        { month: 4, sales: 150 },
        { month: 5, sales: 170 },
    ];
    const regressionResult = calculateRegression(salesData);

    // --- 2. TEST RUNGE-KUTTA (Simulasi Kebusukan) ---
    // Skenario: Melon Grade A (100%), disimpan 7 hari, laju busuk 0.15 (agak cepat)
    const rk4Result = simulateMelonQuality(100, 7, 0.15);

    // --- 3. TEST DIJKSTRA (Rute Logistik) ---
    // Graf sederhana: Kebun -> Gudang -> Pasar
    const logisticsGraph = {
        "Kebun A": { "Gudang Pusat": 10, "Pasar Lokal": 50 },
        "Gudang Pusat": { "Pasar Kota": 20, "Bandara": 40 },
        "Pasar Lokal": { "Pasar Kota": 30 },
        "Pasar Kota": { "Konsumen": 10 },
        "Bandara": { "Konsumen": 5 },
    };

    // Mencari rute dari "Kebun A" ke "Konsumen"
    const routeResult = findShortestPath(logisticsGraph, "Kebun A", "Konsumen");

    // --- RETURN JSON ---
    return NextResponse.json({
        status: "Success",
        message: "Algoritma Core berjalan lancar (Enterprise Standard)",
        data: {
            regression: {
                input: salesData,
                output: regressionResult // Harusnya memprediksi bulan ke-6
            },
            qualitySimulation: {
                note: "Simulasi Runge-Kutta 4 (7 Hari)",
                result: rk4Result // Array penurunan kualitas per hari
            },
            logistics: {
                mission: "Pengiriman Tercepat Kebun A -> Konsumen",
                bestRoute: routeResult // Harusnya cari total bobot terkecil
            }
        }
    });
}