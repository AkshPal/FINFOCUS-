import dotenv from 'dotenv';
import express from 'express';
import { sequelize } from './utils/db';
import { redisClient } from './utils/redis';
import { ws } from './utils/websocket';
import { runFetchNewsJob } from './jobs/fetchNewsJob';
import { CronJob } from 'cron';

dotenv.config();

(
    async () => {
        try {
            await sequelize.authenticate();
            console.log('Postgres Database connected Successfully.');
        }catch (err) {
            console.error('Unable to connect to Postgres Database:', err);
            process.exit(1); // Exit if DB connection fails
        }


        new CronJob(
            '0 8 * * * *', () => {
                runFetchNewsJob().catch(console.error);
            },
            null,
            true
        );

        await runFetchNewsJob();
        
    }
)();