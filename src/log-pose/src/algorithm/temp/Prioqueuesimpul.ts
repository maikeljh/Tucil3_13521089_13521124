class Prioqueuesimpul {
    queue: [number, Simpul, Simpul[]][];

    constructor() {
        this.queue = [];
    }

    enqueue(prio: number, element: Simpul, listPred: Simpul[]): void {
        let newArray = [...listPred]
        if (this.queue.length == 0) {
            this.queue.push([prio, element, newArray]);
            return;
        }
        for (let i = 0; i < this.queue.length; i++) {
            if (i == this.queue.length - 1) {
                this.queue.push([prio, element, newArray]);
                return;
            }

            if (this.queue[i][0] > prio) {
                this.queue.splice(i, 0, [prio, element, newArray]);
                return;
            }
        }

    }

    dequeue(): [number, Simpul, Simpul[]] | undefined {
        return this.queue.shift();
    }

    size(): number {
        return this.queue.length;
    }
}
