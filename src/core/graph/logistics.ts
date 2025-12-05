type GraphMap = {
    [node: string]: { [neighbor: string]: number };
};

interface RouteResult {
    path: string[];   
    distance: number;
}

export const findShortestPath = (graph: GraphMap, startNode: string, endNode: string): RouteResult | null => {
    const costs: { [node: string]: number } = {};
    const parents: { [node: string]: string | null } = {};
    const processed: string[] = [];
    const allNodes = new Set<string>();

    Object.keys(graph).forEach(source => {
        allNodes.add(source);
        Object.keys(graph[source]).forEach(dest => {
            allNodes.add(dest);
        });
    });

    allNodes.forEach(node => {
        if (node === startNode) {
            costs[node] = 0;
        } else {
            costs[node] = Infinity;
        }
        parents[node] = null;
    });

    const getLowestCostNode = (costs: { [node: string]: number }, processed: string[]) => {
        let lowestNode: string | null = null;

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

    while (node) {
        const cost = costs[node];
        const neighbors = graph[node] || {};

        for (const n in neighbors) {
            const newCost = cost + neighbors[n];

            if (newCost < costs[n]) {
                costs[n] = newCost;
                parents[n] = node;
            }
        }

        processed.push(node);
        node = getLowestCostNode(costs, processed);
    }

    if (costs[endNode] === Infinity) return null;

    const path = [endNode];
    let parent = parents[endNode];

    while (parent) {
        path.unshift(parent);
        parent = parents[parent];
    }

    return {
        path,
        distance: costs[endNode],
    };
};