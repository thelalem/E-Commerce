import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { OrderResponseDTO } from '../dtos/order.dto.js';
import { invalidateProductCache } from '../cache/product.cache.js';
import { cacheOrder, getCachedOrder, invalidateOrderCache } from '../cache/order.cache.js';

// Create a new order
export const createOrder = async (req, res, next) => {
    try {
        const buyer = req.user._id; // Extract buyer from the authenticated user
        const { products } = req.body;

        // Validate product IDs
        const productIds = products.map((p) => {
            if (!mongoose.isValidObjectId(p.product)) {
                throw new Error(`Invalid product ID: ${p.product}`);
            }
            return new mongoose.Types.ObjectId(p.product);
        });

        // Fetch product details from the database
        const productDetails = await Product.find({ _id: { $in: productIds } });

        if (productDetails.length !== products.length) {
            return res.status(400).json({ message: 'One or more products are invalid or unavailable.' });
        }

        // Calculate total price, validate stock, and format products
        let totalPrice = 0;
        const formattedProducts = products.map((item) => {
            const product = productDetails.find((p) => p._id.toString() === item.product);
            if (!product) {
                throw new Error(`Product with ID ${item.product} not found.`);
            }

            // Check if the product is in stock
            if (product.stock <= 0) {
                throw new Error(`Product with ID ${item.product} is out of stock.`);
            }

            // Check if the requested quantity is available
            if (item.quantity > product.stock) {
                throw new Error(
                    `Requested quantity (${item.quantity}) for product with ID ${item.product} exceeds available stock (${product.stock}).`
                );
            }

            const price = product.price;
            totalPrice += price * item.quantity;

            // Deduct the ordered quantity from the product's stock
            product.stock -= item.quantity;

            return {
                product: product._id,
                quantity: item.quantity,
                price,
            };
        });

        // Update product stock in the database
        await Promise.all(
            productDetails.map((product) =>
                Product.findByIdAndUpdate(product._id, { stock: product.stock }, { new: true })
            )
        );

        // Create the order
        const order = await Order.create({
            buyer,
            products: formattedProducts,
            totalPrice,
            status: 'pending', // Default status
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

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid order ID.' });
        }

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

        if (req.user.role === 'admin') {
            const cachedOrders = await getCachedOrder(`orders:all`);
            if (cachedOrders) {
                return res.status(200).json(cachedOrders);
            }
        }

        let filter = {};
        if (req.user.role === 'seller') {
            // Only return orders where at least one product belongs to this seller
            filter['products'] = { $elemMatch: { seller: req.user._id } };
        }

        // Populate buyer and products.product (and seller for each product)
        const orders = await Order.find(filter)
            .populate('buyer', 'name email')
            .populate({
                path: 'products.product',
                select: 'name seller',
                populate: { path: 'seller', select: 'name email' }
            });

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

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid order ID.' });
        }

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
        await invalidateOrderCache('orders:all');
        const orderResponse = new OrderResponseDTO(order);
        res.status(200).json({ message: 'Order status updated successfully', order: orderResponse });
    } catch (error) {
        next(error);
    }
};
