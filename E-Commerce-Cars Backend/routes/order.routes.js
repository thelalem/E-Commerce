import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';


import { validateOwnership } from '../middlewares/ownershipValidation.middleware.js';
import {
    createOrder,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
} from '../controllers/order.controller.js';
import Order from '../models/Order.js';
import { validateOrderRequest } from '../middlewares/validate.middleware.js';

const router = express.Router();

// Create a new order (only buyers)
router.post(
    '/',
    protect,
    authorizeRoles('buyer'),
    validateOrderRequest,
    createOrder
);

// Get an order by ID (accessible to buyers and admins)
router.get('/:id', protect, authorizeRoles('buyer', 'admin'), validateOwnership(Order, 'buyer'), getOrderById);

// Get all orders (only admins)
router.get('/', protect, authorizeRoles('admin'), getAllOrders);

// Update order status (only admins)
router.put('/:id/status', protect, authorizeRoles('admin'), updateOrderStatus);

export default router;