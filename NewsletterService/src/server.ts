import dotenv from 'dotenv';
import {wss} from './utils/websocket.js'
import { JobQueue, Job } from './queue/jobQueue.js';
import { sendUserNewsletter, UserNewsPayload } from './services/mailer.js';

dotenv.config();


const workerCnt = parseInt(process.env.WORKER_COUNT || '1');
const jobQueue = new JobQueue<UserNewsPayload>();
const enqueuedUserIds = new Set<number>();

wss.on('connection', socket => {
    socket.on('message', raw => {
        try{
            const payload:UserNewsPayload = JSON.parse(raw.toString());
            if (enqueuedUserIds.has(payload.user_id)) {
                socket.send(JSON.stringify({status:'duplicate', user_id: payload.user_id}));
                return;
            }
            console.log(`Enque job for user ${payload.name}`);
            jobQueue.enqueue(payload);
            enqueuedUserIds.add(payload.user_id);
            socket.send(JSON.stringify({status:'queued',user_id: payload.user_id}));
        }catch(err){
            console.error('Invalid Payload',err);
        }
    });
});

async function worker(id:number) {
    console.log(`Worker ${id} started`);
    while(true) {
        const job:Job<UserNewsPayload> | null = await jobQueue.dequeue();
        if(job) {
            try {
                console.log(`Worker ${id} processing job for user ${job.user_id}`);
                await sendUserNewsletter(job);
                enqueuedUserIds.delete(job.user_id); // Remove from set after processing
                console.log(`Worker ${id} completed job for user ${job.user_id}`);
            } catch (err) {
                console.error(`Worker ${id} failed to process job for user ${job.user_id}`, err);
                enqueuedUserIds.delete(job.user_id); // Remove even on error to allow retry
            }
        } else {
            // No jobs available, wait for a while before checking again
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

for(let i=1;i<= workerCnt;i++) {
    worker(i).catch(err => {
        console.error(`Worker ${i} encountered an error`, err);
    });
}



