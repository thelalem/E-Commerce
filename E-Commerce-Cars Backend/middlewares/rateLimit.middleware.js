import rateLimit from "express-rate-limit";

export const generalRateLimiter = rateLimit({
    windowMS: 15 * 60 * 1000, // 15 minutes
    max: 100, //limit each IP to 100 Request per window
    message: {
        message: 'Too many requests from this IP, please try again after 15 minutes'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    logicHeaders: false,
})



export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, //limit each IP to 5 Request per window
    message: {
        message: 'Too many login attempts , please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

