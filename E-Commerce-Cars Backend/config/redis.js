import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    // password: process.env.REDIS_PASSWORD,
});
redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});
redisClient.on('connect', () => {
    console.log('✅ Redis Client Connected');
});

export default redisClient;
