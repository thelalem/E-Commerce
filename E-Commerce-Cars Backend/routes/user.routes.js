import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import upload from '../middlewares/upload.middleware.js';
import {
    getUserById,
    updateUser,
    deleteUser,
} from '../controllers/user.controller.js';

const router = express.Router();

// Get user by ID (accessible to all authenticated users)s
router.get('/:id', protect, getUserById);

// Update user (accessible to the user themselves or admins)
router.put('/:id', protect, authorizeRoles('buyer', 'seller'), upload.single('profilePicture'), updateUser);

// Soft delete user (accessible to admins only)
router.delete('/:id', protect, authorizeRoles('admin'), deleteUser);

export default router;
