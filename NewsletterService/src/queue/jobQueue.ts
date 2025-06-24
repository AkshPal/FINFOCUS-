

export type Job<T> = T;

export class JobQueue<T> {
    private queue: Job<T>[] = [];
    private resolvers: ((job: Job<T>) => void)[] = [];

    enqueue(job: Job<T>): void {
        if(this.resolvers.length > 0) {
            const resolve = this.resolvers.shift()!;
            resolve(job);
            

        }else {
            this.queue.push(job);
        }
    }

    async dequeue(): Promise<Job<T>> {
        if(this.queue.length > 0) {
            return Promise.resolve(this.queue.shift()!);
        }
        return new Promise<Job<T>>((resolve) => {
            this.resolvers.push(resolve);
        });
    }
}