class UniformCostSearch implements SearchAlgorithm {
    startNode: Simpul;
    goalNode: Simpul;
    listofNodes: Simpul[];
    adjacencyMatrix: Number[][];


    constructor(startNode: Simpul, goalNode: Simpul, json: string) {
        this.startNode = startNode;
        this.goalNode = goalNode;
        const obj = JSON.parse(json)
        this.adjacencyMatrix = obj.matrix;
        for (var i = 0; i < obj.nodes.length; i++) {
            this.listofNodes.push(new Simpul(obj.nodes[i].id, obj.nodes[i].name, obj.nodes[i].latitude, obj.nodes[i].longitude));
            this.listofNodes[i].initNeighbors(this.adjacencyMatrix);
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

        var openList = new Prioqueuesimpul();
        openList.enqueue(0, this.startNode, []);

        var current;
        var currentNode;
        var currentCost;
        var currentRoute;
        var found = false;
        while (openList.size() > 0 && !found) {
            current = openList.dequeue();
            currentCost = current[0];
            currentNode = current[1];
            currentRoute = current[2];
            found = currentNode.id === this.goalNode.id;
            for (var i = 0; i < current.listOfNeighbours.length; i++) {
                // Assign the cost, if higher than the current cost and visited, then skip (no need to enqueue the route)
                if (!Number.isFinite(current.listOfNeighbours[i])) {
                    continue;
                }
                var neighborDistance = currentNode.listOfNeighbours[i];
                var neighborIdx = i;
                // neighbor id is idx + 1
                if (this.listofNodes[neighborIdx].lowest_cost <= neighborDistance + currentCost && this.listofNodes[neighborIdx].visited) {
                    continue;
                } else {
                    // update lowest cost if lower
                    if (this.listofNodes[neighborIdx].lowest_cost > neighborDistance + currentCost) {
                        this.listofNodes[neighborIdx].lowest_cost = neighborDistance + currentCost;
                    }
                    openList.enqueue(neighborDistance + currentCost, this.listofNodes[neighborIdx], currentRoute.push(currentNode));
                }

                // if (neighbor.lowest_cost < current.lowest_cost + this.closestDistance) {
                //     neighbor.lowest_cost = current.lowest_cost + this.closestDistance;
                //     openList.enqueue(neighbor);
                // }
            }
        }
        // Check if found or not
        let route: Simpul[] = []
        if (found) {
            for (var i = 0; i < current.listOfPredecessors.length; i++) {
                route.push(this.listofNodes[current.listOfPredecessors[i] - 1]);
            }
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
    }
}
