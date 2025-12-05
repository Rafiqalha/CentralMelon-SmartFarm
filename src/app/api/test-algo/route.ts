import { NextResponse } from 'next/server';
import { calculateRegression } from '@/core/math/regression';
import { simulateMelonQuality } from '@/core/math/rungeKutta';
import { findShortestPath } from '@/core/graph/logistics';

export async function GET() {
    const salesData = [
        { month: 1, sales: 120 },
        { month: 2, sales: 135 },
        { month: 3, sales: 130 },
        { month: 4, sales: 150 },
        { month: 5, sales: 170 },
    ];
    const regressionResult = calculateRegression(salesData);

    const rk4Result = simulateMelonQuality(100, 7, 0.15);

    const logisticsGraph = {
        "Kebun A": { "Gudang Pusat": 10, "Pasar Lokal": 50 },
        "Gudang Pusat": { "Pasar Kota": 20, "Bandara": 40 },
        "Pasar Lokal": { "Pasar Kota": 30 },
        "Pasar Kota": { "Konsumen": 10 },
        "Bandara": { "Konsumen": 5 },
    };

    const routeResult = findShortestPath(logisticsGraph, "Kebun A", "Konsumen");

    return NextResponse.json({
        status: "Success",
        message: "Algoritma Core berjalan lancar (Enterprise Standard)",
        data: {
            regression: {
                input: salesData,
                output: regressionResult 
            },
            qualitySimulation: {
                note: "Simulasi Runge-Kutta 4 (7 Hari)",
                result: rk4Result 
            },
            logistics: {
                mission: "Pengiriman Tercepat Kebun A -> Konsumen",
                bestRoute: routeResult
            }
        }
    });
}