import { Simpul } from "./Simpul";

export interface SearchAlgorithm {
    setStart(start: Simpul): void;
    setGoal(goal: Simpul): void;
    search(): Simpul[];
    getOptimalDistance(route: Simpul[]): number;
}