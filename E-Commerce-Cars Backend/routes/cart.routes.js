import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { validateDTO } from '../middlewares/validation.middleware.js';
import { AddToCartDTO, UpdateCartDTO } from '../dtos/cart.dto.js';
import {
    getCart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
} from '../controllers/cart.controller.js';

const router = express.Router();

router.get('/', protect, getCart);
router.post('/add', protect, validateDTO(AddToCartDTO), addToCart);
router.delete('/remove/:productId', protect, removeFromCart);
router.patch('/update', protect, validateDTO(UpdateCartDTO), updateCartQuantity);
router.delete('/clear', protect, clearCart);

export default router;