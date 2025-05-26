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
    getFeaturedProducts,
    searchProducts,
    getProductsBySeller,
    batchGetProducts,
} from '../controllers/product.controller.js';
// import { validateProductRequest } from '../middlewares/validate.middleware.js';
import { validateDTO } from '../middlewares/validation.middleware.js';
import { ProductRequestDTO } from '../dtos/product.dto.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();





router.get('/search', searchProducts);
router.get('/featured', getFeaturedProducts);
router.get('/', getAllProducts);
router.get('/seller/:sellerId', protect, authorizeRoles('seller'), getProductsBySeller); // Get products by seller ID
router.get('/:id', getProductById);


// Create a new product (only sellers)
router.post(
    '/',
    protect,
    authorizeRoles('seller'),
    upload.single('image'),
    validateDTO(ProductRequestDTO),
    createProduct
);
router.post('/batch', protect, batchGetProducts); // Batch Get products 

// Update an existing product (only sellers)
router.put(
    '/:id',
    protect,
    authorizeRoles('seller'),
    validateOwnership(Product, 'seller'),
    upload.single('image'),
    validateDTO(ProductRequestDTO),
    updateProduct
);

// Delete a product (only sellers)
router.delete('/:id', protect, authorizeRoles('seller'), validateOwnership(Product, 'seller'), deleteProduct);

//



export default router;
