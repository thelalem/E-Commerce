import Product from '../models/Product.js';
import { cacheProduct, getCachedProduct, invalidateProductCache } from '../cache/product.cache.js';
import { ProductResponseDTO } from '../dtos/product.dto.js';

// Create a new product
export const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, category, location, imageUrl, stock } = req.body;

        const seller = req.user._id;
        console.log('seller:', seller);
        const product = await Product.create({
            name,
            description,
            price,
            category,
            location,
            imageUrl,
            stock,
            seller,
        });

        await invalidateProductCache('products:all');

        const productResponse = new ProductResponseDTO(product);
        res.status(201).json({ message: 'Product created successfully', product: productResponse });
    } catch (error) {
        next(error);
    }
};

// Update an existing product
export const updateProduct = async (req, res, next) => {
    try {
        console.log("Updating Product")
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            return next(error);
        }

        if (product.seller.toString() !== req.user._id.toString()) {
            const error = new Error('You are not authorized to update this product');
            error.statusCode = 403;
            return next(error);
        }

        Object.assign(product, req.body);
        await product.save();

        await invalidateProductCache(`products:${id}`);
        await invalidateProductCache('products:all');

        const productResponse = new ProductResponseDTO(product);
        res.status(200).json({ message: 'Product updated successfully', product: productResponse });
    } catch (error) {
        next(error);
    }
};

// Delete a product (soft delete)
export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            return next(error);
        }

        if (product.seller.toString() !== req.user._id.toString()) {
            const error = new Error('You are not authorized to delete this product');
            error.statusCode = 403;
            return next(error);
        }

        product.deleted = true;
        await product.save();

        await invalidateProductCache(`products:${id}`);
        await invalidateProductCache('products:all');

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Get a product by ID
export const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const cachedProduct = await getCachedProduct(`products:${id}`);
        if (cachedProduct) {
            return res.status(200).json(cachedProduct);
        }

        const product = await Product.findById(id).populate('seller', 'name email');

        if (!product) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            return next(error);
        }

        await cacheProduct(`products:${id}`, product);

        const productResponse = new ProductResponseDTO(product);
        res.status(200).json(productResponse);
    } catch (error) {
        next(error);
    }
};

// Get all products
export const getAllProducts = async (req, res, next) => {
    try {
        const cachedProducts = await getCachedProduct('products:all');
        if (cachedProducts) {
            return res.status(200).json(cachedProducts);
        }

        const products = await Product.find().populate('seller', 'name email');

        await cacheProduct('products:all', products);

        const productResponse = products.map(product => new ProductResponseDTO(product));
        res.status(200).json(productResponse);

    } catch (error) {
        next(error);
    }
};
