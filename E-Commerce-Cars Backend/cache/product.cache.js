import redisClient from "../config/redis.js";

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

export const cacheProduct = async (key, data, expiration = 3600) => {
    try {
        await redisClient.set(key, JSON.stringify(data), { EX: expiration });
    } catch (error) {
        console.error('Error caching product:', error);
    }
};

export const getCachedProduct = async (key) => {
    try {
        const cachedData = await redisClient.get(key);
        return cachedData ? JSON.parse(cachedData) : null;
    } catch (error) {
        console.error('Error retrieving cached product:', error);
        return null;
    }
};

export const invalidateProductCache = async (key) => {
    try {
        await redisClient.del(key);
    } catch (error) {
        console.error('Error invalidating product cache:', error);
    }
};

