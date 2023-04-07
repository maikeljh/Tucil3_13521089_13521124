"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prioqueuesimpul = void 0;
var Prioqueuesimpul = /** @class */ (function () {
    function Prioqueuesimpul() {
        this.queue = [];
    }
    Prioqueuesimpul.prototype.enqueue = function (prio, element, listPred) {
        var newArray = __spreadArray([], listPred, true);
        if (this.queue.length == 0) {
            this.queue.push([prio, element, newArray]);
            return;
        }
        for (var i = 0; i < this.queue.length; i++) {
            if (i == this.queue.length - 1) {
                this.queue.push([prio, element, newArray]);
                return;
            }
            if (this.queue[i][0] > prio) {
                this.queue.splice(i, 0, [prio, element, newArray]);
                return;
            }
        }
    };
    Prioqueuesimpul.prototype.dequeue = function () {
        return this.queue.shift();
    };
    Prioqueuesimpul.prototype.size = function () {
        return this.queue.length;
    };
    return Prioqueuesimpul;
}());
exports.Prioqueuesimpul = Prioqueuesimpul;
