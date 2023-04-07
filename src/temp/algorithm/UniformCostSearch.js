"use strict";
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniformCostSearch = void 0;
var Simpul_1 = require("../../Simpul");
var Prioqueuesimpul_1 = require("./Prioqueuesimpul");
var UniformCostSearch = /** @class */ (function () {
  function UniformCostSearch(startNode, goalNode, json) {
    this.startNode = startNode;
    this.goalNode = goalNode;
    var obj = JSON.parse(json);
    this.adjacencyMatrix = obj.matrix;
    this.startNode.initNeighbors(this.adjacencyMatrix);
    this.goalNode.initNeighbors(this.adjacencyMatrix);
    this.listofNodes = [];
    for (var i = 0; i < obj.nodes.length; i++) {
      this.listofNodes.push(
        new Simpul_1.Simpul(
          obj.nodes[i].id,
          obj.nodes[i].name,
          obj.nodes[i].latitude,
          obj.nodes[i].longitude
        )
      );
      this.listofNodes[i].initNeighbors(this.adjacencyMatrix);
    }
  }
  UniformCostSearch.prototype.setStart = function (start) {
    this.startNode = start;
  };
  UniformCostSearch.prototype.setGoal = function (goal) {
    this.goalNode = goal;
  };
  UniformCostSearch.prototype.search = function () {
    // UCS algorithm
    // Start from start node
    this.listofNodes[this.startNode.id - 1].lowest_cost = 0;
    this.startNode.lowest_cost = 0;
    var openList = new Prioqueuesimpul_1.Prioqueuesimpul();
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
      currentRoute = __spreadArray([], current[2], true);
      found = currentNode.id === this.goalNode.id;
      for (var i = 0; i < currentNode.listOfNeighbours.length; i++) {
        // Assign the cost, if higher than the current cost and visited, then skip (no need to enqueue the route)
        if (!isFinite(currentNode.listOfNeighbours[i])) {
          continue;
        }
        var neighborDistance = currentNode.listOfNeighbours[i];
        var neighborIdx = i;
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
    var route = [];
    if (found) {
      currentRoute.push(currentNode);
      route = currentRoute;
    }
    return route;
  };
  UniformCostSearch.prototype.getOptimalDistance = function () {
    var route = this.search();
    var ret = 0;
    for (var i = 0; i < route.length; i++) {
      ret =
        ret +
        Number(this.adjacencyMatrix[route[i].id - 1][route[i + 1].id - 1]);
    }
    return ret;
  };
  return UniformCostSearch;
})();
exports.UniformCostSearch = UniformCostSearch;
