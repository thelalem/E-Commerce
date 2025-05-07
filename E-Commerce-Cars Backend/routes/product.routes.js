import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

import { validateOwnership } from '../middlewares/ownershipValidation.middleware.js';
import Product from '../models/Product.js';
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getAllProducts,
} from '../controllers/product.controller.js';
import { validateProductRequest } from '../middlewares/validate.middleware.js';

const router = express.Router();

// Create a new product (only sellers)
router.post(
    '/',
    protect,
    authorizeRoles('seller'),
    validateProductRequest,
    createProduct
);

// Update an existing product (only sellers)
router.put(
    '/:id',
    protect,
    authorizeRoles('seller'),
    validateOwnership(Product, 'seller'),
    validateProductRequest,
    updateProduct
);

// Delete a product (only sellers)
router.delete('/:id', protect, authorizeRoles('seller'), validateOwnership(Product, 'seller'), deleteProduct);

// Get a product by ID (accessible to all)
router.get('/:id', protect, getProductById);

// Get all products (accessible to all)
router.get('/', getAllProducts);

export default router;
