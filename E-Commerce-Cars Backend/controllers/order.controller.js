import Order from '../models/Order.js';
import { OrderResponseDTO } from '../dtos/order.dto.js';
import { invalidateProductCache } from '../cache/product.cache.js';
import { cacheOrder, getCachedOrder, invalidateOrderCache } from '../cache/order.cache.js';

// Create a new order
export const createOrder = async (req, res, next) => {
    try {
        const { buyer, products, totalPrice, status } = req.body;

        const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            const error = new Error('Invalid order status');
            error.statusCode = 400;
            return next(error);
        }

        const order = await Order.create({
            buyer,
            products,
            totalPrice,
            status,
        });
        await invalidateOrderCache('orders:all');
        await invalidateProductCache('products:all');

        const orderResponse = new OrderResponseDTO(order);
        res.status(201).json({ message: 'Order created successfully', order: orderResponse });
    } catch (error) {
        next(error);
    }
};

// Get an order by ID
export const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const cachedOrder = await getCachedOrder(`orders:${id}`);
        if (cachedOrder) {
            return res.status(200).json(cachedOrder);
        }

        const order = await Order.findById(id).populate('buyer', 'name email');

        if (!order) {
            const error = new Error('Order not found');
            error.statusCode = 404;
            return next(error);
        }

        const orderResponse = new OrderResponseDTO(order);
        res.status(200).json(orderResponse);
    } catch (error) {
        next(error);
    }
};

// Get all orders
export const getAllOrders = async (req, res, next) => {
    try {
        const cachedOrders = await getCachedOrder(`orders:all`);
        if (cachedOrders) {
            return res.status(200).json(cachedOrders);
        }
        const orders = await Order.find().populate('buyer', 'name email');

        const orderResponses = orders.map((order) => new OrderResponseDTO(order));
        res.status(200).json(orderResponses);
    } catch (error) {
        next(error);
    }
};

// Update order status
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id);

        if (!order) {
            const error = new Error('Order not found');
            error.statusCode = 404;
            return next(error);
        }

        const validTransitions = {
            pending: ['shipped', 'cancelled'],
            shipped: ['delivered'],
            delivered: [],
            cancelled: [],
        };

        if (!validTransitions[order.status].includes(status)) {
            const error = new Error(`Invalid status transition from ${order.status} to ${status}`);
            error.statusCode = 400;
            return next(error);
        }

        order.status = status;
        await order.save();

        await invalidateOrderCache(`orders:${id}`);
        await invalidateOrderCache('orders:all')
        const orderResponse = new OrderResponseDTO(order);
        res.status(200).json({ message: 'Order status updated successfully', order: orderResponse });
    } catch (error) {
        next(error);
    }
};
