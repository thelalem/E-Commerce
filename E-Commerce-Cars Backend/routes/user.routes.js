import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import {
    getUserById,
    updateUser,
    deleteUser,
} from '../controllers/user.controller.js';

const router = express.Router();

// Get user by ID (accessible to all authenticated users)
router.get('/:id', protect, getUserById);

// Update user (accessible to the user themselves or admins)
router.put('/:id', protect, authorizeRoles('admin', 'buyer', 'seller'), updateUser);

// Soft delete user (accessible to admins only)
router.delete('/:id', protect, authorizeRoles('admin'), deleteUser);

export default router;
