'use client';

interface GraphProps {
    route: string[]; // Hasil dari Dijkstra (["Kebun A", "Gudang Pusat", ...])
}

export default function LogisticsGraph({ route }: GraphProps) {
    // Koordinat manual untuk visualisasi yang rapi (Bisa dibuat dinamis nanti)
    const nodes: Record<string, { x: number; y: number }> = {
        "Kebun A": { x: 50, y: 150 },
        "Gudang Pusat": { x: 200, y: 100 },
        "Pasar Lokal": { x: 200, y: 200 },
        "Pasar Kota": { x: 350, y: 100 },
        "Bandara": { x: 350, y: 50 },
        "Konsumen": { x: 500, y: 150 },
    };

    // Definisi semua koneksi (Edge) yang mungkin
    const edges = [
        { from: "Kebun A", to: "Gudang Pusat" },
        { from: "Kebun A", to: "Pasar Lokal" },
        { from: "Gudang Pusat", to: "Pasar Kota" },
        { from: "Gudang Pusat", to: "Bandara" },
        { from: "Pasar Lokal", to: "Pasar Kota" },
        { from: "Pasar Kota", to: "Konsumen" },
        { from: "Bandara", to: "Konsumen" },
    ];

    // Helper: Cek apakah edge ini adalah bagian dari rute terpilih
    const isActiveEdge = (u: string, v: string) => {
        // Cari index u dan v di dalam array route
        const idxU = route.indexOf(u);
        const idxV = route.indexOf(v);

        // Aktif jika keduanya ada di rute DAN bersebelahan (berurutan)
        return idxU !== -1 && idxV !== -1 && Math.abs(idxU - idxV) === 1;
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-1 lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Optimasi Rute Logistik (Dijkstra)</h3>
            <div className="w-full overflow-x-auto flex justify-center">
                <svg width="600" height="250" className="border border-gray-50 rounded-lg bg-slate-50">
                    {/* 1. GAMBAR GARIS (EDGES) */}
                    {edges.map((edge, i) => {
                        const start = nodes[edge.from];
                        const end = nodes[edge.to];
                        const active = isActiveEdge(edge.from, edge.to);

                        return (
                            <line
                                key={i}
                                x1={start.x} y1={start.y}
                                x2={end.x} y2={end.y}
                                stroke={active ? "#10B981" : "#CBD5E1"} // Hijau jika rute aktif, abu jika tidak
                                strokeWidth={active ? 4 : 2}
                                strokeDasharray={active ? "0" : "5,5"} // Putus-putus jika tidak aktif
                            />
                        );
                    })}

                    {/* 2. GAMBAR TITIK (NODES) */}
                    {Object.entries(nodes).map(([name, pos]) => {
                        const isActive = route.includes(name);
                        return (
                            <g key={name}>
                                <circle
                                    cx={pos.x} cy={pos.y}
                                    r={20}
                                    fill={isActive ? "#10B981" : "white"}
                                    stroke={isActive ? "#059669" : "#64748B"}
                                    strokeWidth="3"
                                />
                                <text
                                    x={pos.x} y={pos.y + 35}
                                    textAnchor="middle"
                                    className="text-xs font-semibold fill-gray-600"
                                    style={{ fontSize: '12px' }}
                                >
                                    {name}
                                </text>
                                {/* Icon/Inisial di dalam lingkaran */}
                                <text
                                    x={pos.x} y={pos.y + 5}
                                    textAnchor="middle"
                                    fill={isActive ? "white" : "#64748B"}
                                    fontWeight="bold"
                                >
                                    {name.charAt(0)}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
            <div className="mt-4 flex gap-2 items-center text-sm text-gray-600">
                <span className="w-3 h-3 bg-emerald-500 rounded-full block"></span>
                <span>Rute Terpilih (Cost Terendah)</span>
                <span className="w-3 h-3 bg-slate-300 rounded-full block ml-4"></span>
                <span>Jalur Alternatif</span>
            </div>
        </div>
    );
}