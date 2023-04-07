class Simpul {
  id: number;
  name: string;
  lowest_cost: number = Infinity;
  latitude: number;
  longitude: number;
  // List of neighbors is the distance of neighbors in the adjacency matrix
  // The index + 1 is the neigbor's id
  listOfNeighbours: number[] = [];
  visited: boolean = false;
  // List of predecessors' id
  listOfPredecessors: number[] = [];

  constructor(id: number, name: string, latitude: number, longitude: number) {
    this.id = id;
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
  }

  toString(): String {
    return `id: ${this.id}, name: ${this.name}, lowest_cost: ${this.lowest_cost}, latitude: ${this.latitude}, longitude: ${this.longitude}`;
  }

  static fromString(str: string): Simpul {
    const [id, name, latitude, longitude] = str.split(", ");
    return new Simpul(
      Number(id),
      String(name),
      Number(latitude),
      Number(longitude)
    );
  }
  static fromStringArray(strArray: string[]): Simpul[] {
    return strArray.map((str) => Simpul.fromString(str));
  }

  static fromJSON(json: string): Simpul {
    return Simpul.fromString(json);
  }

  initNeighbors(adjacencyMatrix: Number[][]) {
    var neighbors = adjacencyMatrix[this.id - 1];
    for (var i = 0; i < neighbors.length; i++) {
      this.listOfNeighbours.push(
        Number(neighbors[i]) === 0 ? Infinity : Number(neighbors[i])
      );
    }
  }
}

export { Simpul };
