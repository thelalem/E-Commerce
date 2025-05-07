import Product from '../models/Product.js';
import { cacheProduct, getCachedProduct, invalidateProductCache } from '../cache/product.cache.js';
import { ProductResponseDTO } from '../dtos/product.dto.js';


// Create a new product
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, location, imageUrl, stock } = req.body;

        // Ensure the logged-in user is the seller
        const seller = req.user._id;

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
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update an existing product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the product by ID
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Ensure the logged-in user is the seller of the product
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this product' });
        }

        // Update the product fields
        Object.assign(product, req.body);
        await product.save();

        await invalidateProductCache(`products:${id}`);
        await invalidateProductCache('products:all');

        const productResponse = new ProductResponseDTO(product);
        res.status(200).json({ message: 'Product updated successfully', product: productResponse });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a product (soft delete)
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the product by ID
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Ensure the logged-in user is the seller of the product
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this product' });
        }

        // Soft delete the product
        product.deleted = true;
        await product.save();

        await invalidateProductCache(`products:${id}`);
        await invalidateProductCache('products:all');

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a product by ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const cachedProduct = await getCachedProduct(`products:${id}`);
        if (cachedProduct) {
            return res.status(200).json(cachedProduct);
        }

        // Find the product by ID
        const product = await Product.findById(id).populate('seller', 'name email');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await cacheProduct(`products:${id}`, product); // Cache the product

        const productResponse = new ProductResponseDTO(product);
        res.status(200).json(productResponse);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const cachedProducts = await getCachedProduct('products:all');
        if (cachedProducts) {
            return res.status(200).json(cachedProducts);
        }

        const products = await Product.find().populate('seller', 'name email');

        await cacheProduct('products:all', products); // Cache all products

        const productResponse = products.map(product => new ProductResponseDTO(product));
        res.status(200).json(productResponse);

    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
