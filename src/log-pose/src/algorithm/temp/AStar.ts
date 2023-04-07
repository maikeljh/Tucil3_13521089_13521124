
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
        for (var i = 0; i < obj.nodes.length; i++) {
            this.listofNodes.push(new Simpul(obj.nodes[i].id, obj.nodes[i].name, obj.nodes[i].latitude, obj.nodes[i].longitude));
            this.listofNodes[i].initNeighbors(this.adjacencyMatrix);
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

        var openList = new Prioqueuesimpul();
        openList.enqueue(Number(this.distanceList[this.startNode.id - 1]), this.startNode, []);

        var current;
        var currentNode;
        var currentCost;
        var currentRoute;
        var found = false;
        while (openList.size() > 0 && !found) {
            current = openList.dequeue();
            // Current Cost is Current Priority (f(n))
            currentCost = current[0];
            currentNode = current[1];
            currentRoute = current[2];
            this.listofNodes[currentNode.id - 1].visited = true;
            found = currentNode.id === this.goalNode.id;
            for (var i = 0; i < current.listOfNeighbours.length; i++) {
                // No need to visit if already visited
                if (!Number.isFinite(current.listOfNeighbours[i])) {
                    continue;
                }
                var neighborDistance = currentNode.listOfNeighbours[i];
                var neighborIdx = i;
                // neighbor id is idx + 1
                var nextRoute = [...currentRoute];
                nextRoute.push(this.listofNodes[neighborIdx]);
                // Get g(n)
                let gn: number = 0;
                for (var j = 0; j < nextRoute.length - 1; j++) {
                    gn += nextRoute[j].listOfNeighbours[nextRoute[j+1]]
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
                    openList.enqueue(gn + hn, this.listofNodes[neighborIdx], currentRoute.push(currentNode));
                }
            }
        }
        // Check if found or not
        let route: Simpul[] = []
        if (found) {
            route = currentRoute;
        }

        return route;
    }

    getOptimalDistance(): number {
        let route: Simpul[] = this.search();
        var ret = 0;
        for (var i = 0; i < route.length; i++) {
            ret = ret + Number(this.adjacencyMatrix[route[i].id - 1][route[i+1].id -1]);
        }
        return ret;
        // Technically can only return goalNode.lowest_cost
    }

}
