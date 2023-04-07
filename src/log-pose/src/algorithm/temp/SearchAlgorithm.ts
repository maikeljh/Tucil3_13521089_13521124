interface SearchAlgorithm {
    setStart(start: Simpul): void;
    setGoal(goal: Simpul): void;
    search(): Simpul[];
    getOptimalDistance(): number;
}
