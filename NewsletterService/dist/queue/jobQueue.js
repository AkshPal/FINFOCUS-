"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobQueue = void 0;
class JobQueue {
    constructor() {
        this.queue = [];
        this.resolvers = [];
    }
    enqueue(job) {
        if (this.resolvers.length > 0) {
            const resolve = this.resolvers.shift();
            resolve(job);
        }
        else {
            this.queue.push(job);
        }
    }
    async dequeue() {
        if (this.queue.length > 0) {
            return Promise.resolve(this.queue.shift());
        }
        return new Promise((resolve) => {
            this.resolvers.push(resolve);
        });
    }
}
exports.JobQueue = JobQueue;
