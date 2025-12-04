'use client';

import Navbar from '@/components/Navbar';
import IoTDashboard from '@/components/dashboard/IoTDashboard';

export default function IotPage() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <Navbar />
            <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900">Smart Greenhouse IoT</h1>
                    <p className="text-gray-500">Monitoring & Controlling System berbasis AI.</p>
                </div>
                <IoTDashboard />
            </div>
        </main>
    );
}