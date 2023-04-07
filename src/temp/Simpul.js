"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simpul = void 0;
var Simpul = /** @class */ (function () {
    function Simpul(id, name, latitude, longitude) {
        this.lowest_cost = Infinity;
        // List of neighbors is the distance of neighbors in the adjacency matrix
        // The index + 1 is the neigbor's id
        this.listOfNeighbours = [];
        this.visited = false;
        // List of predecessors' id
        this.listOfPredecessors = [];
        this.id = id;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
    }
    Simpul.prototype.toString = function () {
        return "id: ".concat(this.id, ", name: ").concat(this.name, ", lowest_cost: ").concat(this.lowest_cost, ", latitude: ").concat(this.latitude, ", longitude: ").concat(this.longitude);
    };
    Simpul.fromString = function (str) {
        var _a = str.split(", "), id = _a[0], name = _a[1], latitude = _a[2], longitude = _a[3];
        return new Simpul(Number(id), String(name), Number(latitude), Number(longitude));
    };
    Simpul.fromStringArray = function (strArray) {
        return strArray.map(function (str) { return Simpul.fromString(str); });
    };
    Simpul.fromJSON = function (json) {
        return Simpul.fromString(json);
    };
    Simpul.prototype.initNeighbors = function (adjacencyMatrix) {
        var neighbors = adjacencyMatrix[this.id - 1];
        for (var i = 0; i < neighbors.length; i++) {
            this.listOfNeighbours.push(Number(neighbors[i]) === 0 ? Infinity : Number(neighbors[i]));
        }
    };
    return Simpul;
}());
exports.Simpul = Simpul;
