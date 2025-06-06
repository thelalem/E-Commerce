import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';


import { validateOwnership } from '../middlewares/ownershipValidation.middleware.js';
import {
    createOrder,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    getBuyerOrders,
    getOrderBySeller,
} from '../controllers/order.controller.js';
import Order from '../models/Order.js';
// import { validateOrderRequest } from '../middlewares/validate.middleware.js';
import { validateDTO } from '../middlewares/validation.middleware.js';
import { OrderRequestDTO } from '../dtos/order.dto.js';

const router = express.Router();

// Create a new order (only buyers)
router.post(
    '/',
    protect,
    authorizeRoles('buyer'),
    validateDTO(OrderRequestDTO),
    createOrder
);
router.get('/buyer', protect, authorizeRoles('buyer'), getBuyerOrders);


// Get an order by ID (accessible to buyers and admins)
router.get('/:id', protect, authorizeRoles('buyer', 'admin'), validateOwnership(Order, 'buyer'), getOrderById);


// Get all orders 
// router.get('/', protect, authorizeRoles('admin'), getAllOrders);

router.get('/seller/orders', protect, authorizeRoles('seller'), getOrderBySeller);
// Update order status 
router.put('/:id/status', protect, authorizeRoles('seller'), updateOrderStatus);

export default router;