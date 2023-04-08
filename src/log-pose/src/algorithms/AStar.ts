import { Simpul } from "./Simpul";
import { SearchAlgorithm } from "./SearchAlgorithm";
import { Prioqueuesimpul } from "./Prioqueuesimpul";

class AStar implements SearchAlgorithm {
    startNode: Simpul;
    goalNode: Simpul;
    listofNodes: Simpul[];
    adjacencyMatrix: Number[][];
    // Distance Matrix computes the approx. distance from all nodes to the goal node
    distanceList: Number[];

    constructor(startNode: Simpul, goalNode: Simpul, json: string) {
        this.startNode = startNode;
        this.goalNode = goalNode;
        const obj = JSON.parse(json);
        this.adjacencyMatrix = obj.matrix;
        this.listofNodes = [];
        this.distanceList = [];
        for (let i = 0; i < obj.nodes.length; i++) {
            this.listofNodes.push(new Simpul(obj.nodes[i].id, obj.nodes[i].name, obj.nodes[i].latitude, obj.nodes[i].longitude));
        }

        for (let i = 0; i < obj.nodes.length; i++) {
            this.listofNodes[i].initNeighbors(this.adjacencyMatrix, this.listofNodes);
        }

        for (let i = 0; i < this.listofNodes.length; i++) {
            this.distanceList.push(this.listofNodes[i].getApproxDistance(goalNode));
        }

    }

    setStart(start: Simpul): void {
        this.startNode = start;
    }

    setGoal(goal: Simpul): void {
        this.goalNode = goal;
    }

    search(): Simpul[] {
        // A* Algorithm

        // Start from start node

        this.listofNodes[this.startNode.id - 1].lowest_cost = 0;
        this.startNode.lowest_cost = 0;

        let openList = new Prioqueuesimpul();
        openList.enqueue(Number(this.distanceList[this.startNode.id - 1]), this.startNode, [this.startNode]);

        let current;
        let currentNode;
        let currentCost;
        let currentRoute;
        let found = false;
        while (openList.size() > 0 && !found) {
            current = openList.dequeue();
            // Current Cost is Current Priority (f(n))
            currentCost = current[0];
            currentNode = current[1];
            currentRoute = current[2];
            this.listofNodes[currentNode.id - 1].visited = true;
            found = currentNode.id === this.goalNode.id;
            for (let i = 0; i < currentNode.listOfNeighbours.length; i++) {
                // No need to visit if already visited
                if (!Number.isFinite(currentNode.listOfNeighbours[i])) {
                    continue;
                }
                let neighborDistance = currentNode.listOfNeighbours[i];
                let neighborIdx = i;
                // neighbor id is idx + 1
                let nextRoute = [...currentRoute];
                nextRoute.push(this.listofNodes[neighborIdx]);
                // Get g(n)
                let gn: number = 0;
                for (let j = 0; j < nextRoute.length - 1; j++) {
                    gn += nextRoute[j].listOfNeighbours[nextRoute[j+1].id-1]
                }
                // Get h(n)
                let hn: number = Number(this.distanceList[neighborIdx]);
                // No need to enqueue if already visited
                if (this.listofNodes[neighborIdx].visited) {
                    continue;
                } else {
                    // update lowest cost if lower, only updates to g(n)
                    if (this.listofNodes[neighborIdx].lowest_cost > gn) {
                        this.listofNodes[neighborIdx].lowest_cost = gn;
                    }
                    let newRoute = [...currentRoute];
                    newRoute.push(currentNode);
                    openList.enqueue(gn + hn, this.listofNodes[neighborIdx], nextRoute);
                }
            }
        }
        // Check if found or not
        let route: Simpul[] = []
        if (found) {
            route = currentRoute;
            // route.push(currentNode);
        }

        return route;
    }

    getOptimalDistance(route: Simpul[]): number {
        let ret = 0;
        for (let i = 0; i < route.length - 1; i++) {
            ret = ret + route[i].getApproxDistance(route[i+1]);
        }
        return ret / 1000;
        // Technically can only return goalNode.lowest_cost
    }

}

export { AStar }
