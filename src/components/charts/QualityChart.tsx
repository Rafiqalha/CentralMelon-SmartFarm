'use client';

import '@/lib/chartSetup';
import { Line } from 'react-chartjs-2';

interface QualityChartProps {
    simulationData: { day: number; quality: number }[];
}

export default function QualityChart({ simulationData }: QualityChartProps) {
    const data = {
        labels: simulationData.map((d) => `Hari ke-${d.day}`),
        datasets: [
            {
                label: 'Kualitas Buah (%)',
                data: simulationData.map((d) => d.quality),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: (context: any) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(53, 162, 235, 0.5)');
                    gradient.addColorStop(1, 'rgba(53, 162, 235, 0.0)');
                    return gradient;
                },
                fill: true,
                tension: 0.4, 
            },
        ],
    };

    const options = {
        scales: {
            y: {
                min: 0,
                max: 100,
            },
        },
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Simulasi Kebusukan (Runge-Kutta 4)</h3>
            <Line data={data} options={options} />
            <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-sm rounded-lg">
                ℹ️ <strong>Insight:</strong> Buah akan menyentuh batas kritis (40%) pada hari ke-6.
            </div>
        </div>
    );
}