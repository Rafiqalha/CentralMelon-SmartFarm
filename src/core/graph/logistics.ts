// Tipe data Graph (Adjacency List)
type GraphMap = {
    [node: string]: { [neighbor: string]: number };
};

interface RouteResult {
    path: string[];   // Urutan lokasi
    distance: number; // Total biaya/jarak
}

/**
 * Dijkstra's Algorithm (Enterprise Robust Version)
 * Mampu menangani node tujuan yang tidak didefinisikan sebagai source di graph.
 */
export const findShortestPath = (graph: GraphMap, startNode: string, endNode: string): RouteResult | null => {
    const costs: { [node: string]: number } = {};
    const parents: { [node: string]: string | null } = {};
    const processed: string[] = [];

    // LANGKAH 1: Kumpulkan SEMUA node unik (Source & Destination)
    // Agar node ujung (seperti "Konsumen") tetap terdaftar di sistem
    const allNodes = new Set<string>();

    Object.keys(graph).forEach(source => {
        allNodes.add(source);
        Object.keys(graph[source]).forEach(dest => {
            allNodes.add(dest);
        });
    });

    // LANGKAH 2: Inisialisasi Biaya (Infinity)
    allNodes.forEach(node => {
        if (node === startNode) {
            costs[node] = 0;
        } else {
            costs[node] = Infinity;
        }
        parents[node] = null;
    });

    // Helper: Cari node termurah yang belum diproses
    const getLowestCostNode = (costs: { [node: string]: number }, processed: string[]) => {
        let lowestNode: string | null = null;

        // Iterasi manual lebih aman daripada reduce untuk kasus undefined
        for (const node in costs) {
            const cost = costs[node];
            if (!processed.includes(node)) {
                if (lowestNode === null || cost < costs[lowestNode]) {
                    lowestNode = node;
                }
            }
        }
        return lowestNode;
    };

    let node = getLowestCostNode(costs, processed);

    // LANGKAH 3: Loop Utama Dijkstra
    while (node) {
        const cost = costs[node];

        // Ambil tetangga (jika node tidak ada di graph definition, anggap tidak punya tetangga/kosong)
        const neighbors = graph[node] || {};

        for (const n in neighbors) {
            const newCost = cost + neighbors[n];

            // Jika ditemukan rute yang lebih murah
            if (newCost < costs[n]) {
                costs[n] = newCost;
                parents[n] = node;
            }
        }

        processed.push(node);
        node = getLowestCostNode(costs, processed);
    }

    // LANGKAH 4: Rekonstruksi Jalur (Backtracking)
    // Jika cost ke endNode masih Infinity, artinya tidak ada jalan
    if (costs[endNode] === Infinity) return null;

    const path = [endNode];
    let parent = parents[endNode];

    while (parent) {
        path.unshift(parent); // Masukkan ke urutan paling depan
        parent = parents[parent];
    }

    return {
        path,
        distance: costs[endNode],
    };
};