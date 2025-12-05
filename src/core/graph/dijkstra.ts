export type Graph = {
    [key: string]: { [key: string]: number };
};

export const LOCATION_NODES: { [key: string]: [number, number] } = {
    "GUDANG_PUSAT": [-8.0268239, 112.040185], 
    "SIMPANG_A": [-8.035, 112.045],
    "SIMPANG_B": [-8.020, 112.030],
    "PASAR_SRENGAT": [-8.067, 112.072],
    "KOTA_BLITAR": [-8.095, 112.160],
    "CUSTOMER_1": [-8.040, 112.050], 
    "CUSTOMER_2": [-8.070, 112.080],
};

export const ROAD_NETWORK: Graph = {
    "GUDANG_PUSAT": { "SIMPANG_A": 2, "SIMPANG_B": 1.5 },
    "SIMPANG_A": { "GUDANG_PUSAT": 2, "CUSTOMER_1": 1, "PASAR_SRENGAT": 5 },
    "SIMPANG_B": { "GUDANG_PUSAT": 1.5, "KOTA_BLITAR": 12 },
    "CUSTOMER_1": { "SIMPANG_A": 1, "PASAR_SRENGAT": 3 },
    "PASAR_SRENGAT": { "SIMPANG_A": 5, "CUSTOMER_1": 3, "CUSTOMER_2": 2 },
    "CUSTOMER_2": { "PASAR_SRENGAT": 2, "KOTA_BLITAR": 8 },
    "KOTA_BLITAR": { "SIMPANG_B": 12, "CUSTOMER_2": 8 }
};

export function findShortestPath(graph: Graph, startNode: string, endNode: string) {
    let distances: { [key: string]: number } = {};
    let prev: { [key: string]: string | null } = {};
    let pq: string[] = [];

    for (let node in graph) {
        distances[node] = Infinity;
        prev[node] = null;
        pq.push(node);
    }
    distances[startNode] = 0;

    while (pq.length > 0) {
        pq.sort((a, b) => distances[a] - distances[b]);
        let closestNode = pq.shift();

        if (closestNode === endNode) break;
        if (!closestNode || distances[closestNode] === Infinity) break;

        for (let neighbor in graph[closestNode]) {
            let alt = distances[closestNode] + graph[closestNode][neighbor];
            if (alt < distances[neighbor]) {
                distances[neighbor] = alt;
                prev[neighbor] = closestNode;
            }
        }
    }

    let path = [];
    let u: string | null = endNode;
    while (u) {
        path.unshift(u);
        u = prev[u];
    }

    const coordinates = path.map(p => LOCATION_NODES[p] || [0, 0]);

    return { path, distance: distances[endNode], coordinates };
}