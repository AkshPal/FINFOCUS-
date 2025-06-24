import {createClient, RedisClientType} from 'redis';
import dotenv from 'dotenv';
dotenv.config();

export const redisClient: RedisClientType = createClient({
    url: process.env.REDIS_URL,
});

redisClient.connect()
    .then(() => {  
        console.log('Redis client connected successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to Redis:', err);
    });

// export {redisClient}