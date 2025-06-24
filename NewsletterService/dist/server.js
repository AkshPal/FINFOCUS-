"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const websocket_js_1 = require("./utils/websocket.js");
const jobQueue_js_1 = require("./queue/jobQueue.js");
const mailer_js_1 = require("./services/mailer.js");
dotenv_1.default.config();
const workerCnt = parseInt(process.env.WORKER_COUNT || '1');
const jobQueue = new jobQueue_js_1.JobQueue();
const enqueuedUserIds = new Set();
websocket_js_1.wss.on('connection', socket => {
    socket.on('message', raw => {
        try {
            const payload = JSON.parse(raw.toString());
            if (enqueuedUserIds.has(payload.user_id)) {
                socket.send(JSON.stringify({ status: 'duplicate', user_id: payload.user_id }));
                return;
            }
            console.log(`Enque job for user ${payload.name}`);
            jobQueue.enqueue(payload);
            enqueuedUserIds.add(payload.user_id);
            socket.send(JSON.stringify({ status: 'queued', user_id: payload.user_id }));
        }
        catch (err) {
            console.error('Invalid Payload', err);
        }
    });
});
async function worker(id) {
    console.log(`Worker ${id} started`);
    while (true) {
        const job = await jobQueue.dequeue();
        if (job) {
            try {
                console.log(`Worker ${id} processing job for user ${job.user_id}`);
                await (0, mailer_js_1.sendUserNewsletter)(job);
                enqueuedUserIds.delete(job.user_id); // Remove from set after processing
                console.log(`Worker ${id} completed job for user ${job.user_id}`);
            }
            catch (err) {
                console.error(`Worker ${id} failed to process job for user ${job.user_id}`, err);
                enqueuedUserIds.delete(job.user_id); // Remove even on error to allow retry
            }
        }
        else {
            // No jobs available, wait for a while before checking again
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}
for (let i = 1; i <= workerCnt; i++) {
    worker(i).catch(err => {
        console.error(`Worker ${i} encountered an error`, err);
    });
}
