import { Simpul } from "./Simpul";
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
    this.startNode.initNeighbors(this.adjacencyMatrix);
    this.goalNode.initNeighbors(this.adjacencyMatrix);
    this.listofNodes = [];
    for (let i = 0; i < obj.nodes.length; i++) {
      this.listofNodes.push(
        new Simpul(
          obj.nodes[i].id,
          obj.nodes[i].name,
          obj.nodes[i].latitude,
          obj.nodes[i].longitude
        )
      );
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
      currentRoute = [...current[2]];
      found = currentNode.id === this.goalNode.id;
      for (let i = 0; i < currentNode.listOfNeighbours.length; i++) {
        // Assign the cost, if higher than the current cost and visited, then skip (no need to enqueue the route)
        if (!isFinite(currentNode.listOfNeighbours[i])) {
          continue;
        }
        let neighborDistance = currentNode.listOfNeighbours[i];
        let neighborIdx = i;
        // neighbor id is idx + 1
        if (
          this.listofNodes[neighborIdx].lowest_cost <=
            neighborDistance + currentCost ||
          this.listofNodes[neighborIdx].visited
        ) {
          continue;
        } else {
          // update lowest cost if lower
          if (
            this.listofNodes[neighborIdx].lowest_cost >
            neighborDistance + currentCost
          ) {
            this.listofNodes[neighborIdx].lowest_cost =
              neighborDistance + currentCost;
          }
          currentRoute.push(currentNode);
          openList.enqueue(
            neighborDistance + currentCost,
            this.listofNodes[neighborIdx],
            currentRoute
          );
          this.listofNodes[neighborIdx].visited = true;
        }

        // if (neighbor.lowest_cost < current.lowest_cost + this.closestDistance) {
        //     neighbor.lowest_cost = current.lowest_cost + this.closestDistance;
        //     openList.enqueue(neighbor);
        // }
      }
    }
    // Check if found or not
    let route: Simpul[] = [];
    if (found) {
      currentRoute.push(currentNode);
      route = currentRoute;
    }

    return route;
  }

  getOptimalDistance(): number {
    let route: Simpul[] = this.search();
    let ret = 0;
    for (let i = 0; i < route.length; i++) {
      ret =
        ret +
        Number(this.adjacencyMatrix[route[i].id - 1][route[i + 1].id - 1]);
    }
    return ret;
  }
}

export { UniformCostSearch }