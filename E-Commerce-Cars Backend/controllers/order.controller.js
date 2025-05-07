import Order from '../models/Order.js';
import { OrderResponseDTO } from '../dtos/order.dto.js';
import { invalidateProductCache } from '../cache/product.cache.js';

// Create a new order
export const createOrder = async (req, res) => {
    try {
        const { buyer, products, totalPrice, status } = req.body;

        // Validate status (optional: ensure it's one of the allowed values)
        const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }

        // Create the order
        const order = await Order.create({
            buyer,
            products,
            totalPrice,
            status,
        });

        // Invalidate product cache (optional, if products are affected)
        await invalidateProductCache('products:all');

        // Format the response using OrderResponseDTO
        const orderResponse = new OrderResponseDTO(order);
        res.status(201).json({ message: 'Order created successfully', order: orderResponse });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
};

// Get an order by ID
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the order by ID
        const order = await Order.findById(id).populate('buyer', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Format the response using OrderResponseDTO
        const orderResponse = new OrderResponseDTO(order);
        res.status(200).json(orderResponse);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Failed to fetch order', error: error.message });
    }
};

// Get all orders
export const getAllOrders = async (req, res) => {
    try {
        // Fetch all orders
        const orders = await Order.find().populate('buyer', 'name email');

        // Format the response using OrderResponseDTO
        const orderResponses = orders.map((order) => new OrderResponseDTO(order));
        res.status(200).json(orderResponses);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
    }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Find the order by ID
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Validate status transition
        const validTransitions = {
            pending: ['shipped', 'cancelled'],
            shipped: ['delivered'],
            delivered: [],
            cancelled: [],
        };

        if (!validTransitions[order.status].includes(status)) {
            return res.status(400).json({ message: `Invalid status transition from ${order.status} to ${status}` });
        }

        // Update the order status
        order.status = status;
        await order.save();

        // Format the response using OrderResponseDTO
        const orderResponse = new OrderResponseDTO(order);
        res.status(200).json({ message: 'Order status updated successfully', order: orderResponse });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Failed to update order status', error: error.message });
    }
};
