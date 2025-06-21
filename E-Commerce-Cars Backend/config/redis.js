import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
        tls: true,
        rejectUnauthorized: false,
    },
});
redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});
redisClient.on('connect', () => {
    console.log('✅ Redis Client Connected');
});

export default redisClient;
