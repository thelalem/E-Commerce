import redisClient from "../config/redis";

redisClient.on('error', (err) => {
    console.error('Redis Connection error:', err);

});

export const cacheOrder = async (key, data, expiration = 3600) => {
    try {
        await redisClient.set(key, JSON.stringify(data), { EX: expiration })
    } catch (error) {
        console.error('Error caching order: ', error);
    }
};

export const getCachedOrder = async (key) => {
    try {
        const cachedData = await redisClient.get(key);
        return cachedData ? JSON.parse(cachedData) : null;
    } catch (error) {
        console.error('Error retrieving cached order:', error);
        return null;
    }
};

export const invalidateOrderCache = async (key) => {
    try {
        await redisClient.del(key);
    } catch (error) {
        console.error('Error invalidating order cache:', error);
    }
};


