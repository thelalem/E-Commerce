import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/api-docs.json' with { type: 'json' };
import dotenv from 'dotenv';
import { createClient } from 'redis';
import { errorHandler } from './middlewares/error.middleware.js';

import connectDB from './config/db.js';
import redisClient from './config/redis.js';

import { generalRateLimiter, loginRateLimiter } from './middlewares/rateLimit.middleware.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import cartRoutes from './routes/cart.routes.js';
import favoriteRoutes from './routes/favorite.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// import semanticRoutes from './routes/semantic.routes.js';



dotenv.config();
connectDB();
redisClient.connect();


const app = express();
const PORT = process.env.PORT || 5000;


app.use(generalRateLimiter);
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//middlewares

app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
});
// app.use(limiter);


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favorites', favoriteRoutes)
// app.use('/api/semantic', semanticRoutes);


app.all('/*splat', (req, res, next) => {
    const error = new Error(`Cannot find ${req.originalUrl} on this server`);
    error.statusCode = 404;
    next(error);
});


app.get('/', (req, res) => {
    res.send('Welcome to Car Shop');
});

app.use(errorHandler);



export default app;