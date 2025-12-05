'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Truck, MapPin, Navigation, Package, Clock, CheckCircle } from 'lucide-react';
import { findShortestPath, ROAD_NETWORK, LOCATION_NODES } from '@/core/graph/dijkstra';

const CourierMap = dynamic(() => import('@/components/dashboard/CourierMap'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">Memuat Peta...</div>
});

const ORDERS = [
    { id: 'INV-001', customer: 'Budi Santoso', locationNode: 'CUSTOMER_1', status: 'Pending', items: '2x Golden Apollo' },
    { id: 'INV-002', customer: 'Siti Aminah', locationNode: 'CUSTOMER_2', status: 'Pending', items: '5x Rock Melon' },
    { id: 'INV-003', customer: 'Resto Padang', locationNode: 'PASAR_SRENGAT', status: 'Delivered', items: '10x Honey Globe' },
];

export default function CourierDashboard() {
    const [selectedOrder, setSelectedOrder] = useState<any>(ORDERS[0]);

    const startNode = "GUDANG_PUSAT";
    const endNode = selectedOrder.locationNode;
    const routeResult = findShortestPath(ROAD_NETWORK, startNode, endNode);
    const handleSelectOrder = (order: any) => {
        setSelectedOrder(order);
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">

            {/* --- SIDEBAR DAFTAR PENGIRIMAN --- */}
            <div className="w-96 bg-white border-r border-gray-200 flex flex-col z-10 shadow-xl">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Truck className="text-emerald-600" /> Kurir Panel
                    </h1>
                    <p className="text-gray-500 text-xs mt-1">Optimasi Rute Pengiriman AI</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {ORDERS.map((order) => (
                        <div
                            key={order.id}
                            onClick={() => handleSelectOrder(order)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${selectedOrder.id === order.id
                                    ? 'bg-slate-900 text-white shadow-lg scale-[1.02]'
                                    : 'bg-white border-gray-100 hover:border-emerald-200 hover:bg-emerald-50 text-slate-700'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold">{order.id}</h3>
                                <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${order.status === 'Pending' ? 'bg-amber-400 text-amber-900' : 'bg-emerald-400 text-emerald-900'}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm opacity-90 mb-1">
                                <MapPin size={14} /> {order.customer}
                            </div>
                            <div className="flex items-center gap-2 text-xs opacity-70">
                                <Package size={14} /> {order.items}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 flex flex-col relative">

                {/* Overlay Detail Rute */}
                <div className="absolute top-6 left-6 z-1000 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/20 max-w-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Navigation size={20} className="text-blue-600" /> Rute Terpendek
                    </h2>

                    <div className="flex items-center justify-between mb-4 bg-blue-50 p-3 rounded-xl border border-blue-100">
                        <div>
                            <p className="text-xs text-blue-500 font-bold uppercase">Estimasi Jarak</p>
                            <p className="text-2xl font-bold text-slate-800">{routeResult.distance} KM</p>
                        </div>
                        <Clock className="text-blue-300" size={32} />
                    </div>

                    <div className="space-y-4">
                        <div className="relative pl-4 border-l-2 border-dashed border-gray-300 space-y-6">
                            {routeResult.path.map((node, index) => (
                                <div key={index} className="relative">
                                    <span className={`absolute -left-[21px] w-3 h-3 rounded-full ${index === 0 ? 'bg-emerald-500' : index === routeResult.path.length - 1 ? 'bg-red-500' : 'bg-gray-300'}`}></span>
                                    <p className="text-sm font-bold text-slate-700">{node.replace('_', ' ')}</p>
                                    {index < routeResult.path.length - 1 && (
                                        <p className="text-xs text-gray-400 mt-1">Lanjut ke titik berikutnya...</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="w-full mt-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 flex items-center justify-center gap-2">
                        <CheckCircle size={18} /> Mulai Pengiriman
                    </button>
                </div>

                {/* Map Component */}
                <div className="flex-1 w-full h-full p-4">
                    <CourierMap
                        routeCoords={routeResult.coordinates}
                        startPoint={LOCATION_NODES[startNode]}
                        endPoint={LOCATION_NODES[endNode]}
                    />
                </div>
            </div>
        </div>
    );
}