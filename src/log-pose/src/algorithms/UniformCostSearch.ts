import { Simpul } from "./Simpul"
import { SearchAlgorithm } from "./SearchAlgorithm";
import { Prioqueuesimpul } from "./Prioqueuesimpul";

class UniformCostSearch implements SearchAlgorithm {
    startNode: Simpul;
    goalNode: Simpul;
    listofNodes: Simpul[];
    adjacencyMatrix: Number[][];

    constructor(startNode: Simpul, goalNode: Simpul, json: string) {
        this.startNode = startNode;
        this.goalNode = goalNode;
        const obj = JSON.parse(json);
        this.adjacencyMatrix = obj.matrix;
        this.listofNodes = [];
        for (let i = 0; i < obj.nodes.length; i++) {
            this.listofNodes.push(new Simpul(obj.nodes[i].id, obj.nodes[i].name, obj.nodes[i].latitude, obj.nodes[i].longitude));
        }
        for (let i = 0; i < obj.nodes.length; i++) {
            this.listofNodes[i].initNeighbors(this.adjacencyMatrix, this.listofNodes);
        }
    }

    setStart(start: Simpul): void {
        this.startNode = start;
    }

    setGoal(goal: Simpul): void {
        this.goalNode = goal;
    }

    search(): Simpul[] {
        // UCS algorithm
        // Start from start node

        this.listofNodes[this.startNode.id - 1].lowest_cost = 0;
        this.startNode.lowest_cost = 0;

        let openList = new Prioqueuesimpul();
        openList.enqueue(0, this.startNode, []);

        let current;
        let currentNode;
        let currentCost;
        let currentRoute;
        let found = false;

        while (openList.size() > 0 && !found) {
            current = openList.dequeue();
            currentCost = current[0];
            currentNode = current[1];
            currentRoute = current[2];
            this.listofNodes[currentNode.id - 1].visited = true;
            found = currentNode.id === this.goalNode.id;
            for (let i = 0; i < currentNode.listOfNeighbours.length && !found; i++) {
                // Assign the cost, if higher than the current cost and visited, then skip (no need to enqueue the route)
                if (!Number.isFinite(currentNode.listOfNeighbours[i])) {
                    continue;
                }
                let neighborDistance = currentNode.listOfNeighbours[i];
                let neighborIdx = i;
                // neighbor id is idx + 1
                if (this.listofNodes[neighborIdx].lowest_cost <= neighborDistance + currentCost && this.listofNodes[neighborIdx].visited) {
                    continue;
                } else {
                    // update lowest cost if lower
                    if (this.listofNodes[neighborIdx].lowest_cost > neighborDistance + currentCost) {
                        this.listofNodes[neighborIdx].lowest_cost = neighborDistance + currentCost;
                    }
                    let newRoute = [...currentRoute];
                    newRoute.push(currentNode);
                    openList.enqueue(neighborDistance + currentCost, this.listofNodes[neighborIdx], newRoute);
                }
            }
        }
        // Check if found or not
        let route: Simpul[] = [];
        if (found) {
            route = currentRoute;
            route.push(currentNode);
        }

        return route;
    }

    getOptimalDistance(route: Simpul[]): number {
        let ret = 0;
        for (let i = 0; i < route.length - 1; i++) {
            ret = ret + route[i].getApproxDistance(route[i+1]);
        }
        return ret;
    }
}

export { UniformCostSearch }