import Product from '../models/Product.js';
import { cacheProduct, getCachedProduct, invalidateProductCache } from '../cache/product.cache.js';
import { ProductResponseDTO } from '../dtos/product.dto.js';
import mongoose from 'mongoose';

// Create a new product
export const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, category, location, stock } = req.body;
        const imageUrl = req.file ? `uploads/${req.file.filename}` : null;
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

        await invalidateProductCache('products:all'); // Invalidate all products
        await invalidateProductCache(`sellerProducts:${seller}`); // Invalidate seller-specific products
        await invalidateProductCache('search:{}'); // Invalidate default search results

        const productResponse = new ProductResponseDTO(product);
        console.log("productResponse", productResponse);
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
        if (!req.body) {
            return res.status(400).json({ message: 'Request body is missing' });
        }

        const product = await Product.findById(id);
        const seller = product.seller;

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

        const allowedUpdates = ['name', 'description', 'price', 'category', 'location', 'imageUrl', 'stock', 'isFeatured'];
        const updates = {};

        allowedUpdates.forEach(field => {
            if (field in req.body) {
                updates[field] = req.body[field];
            }
        });

        const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
            new: true, // Return the updated document
            runValidators: true,
        }).populate('seller', 'name email');



        await invalidateProductCache(`products:${id}`);
        await invalidateProductCache('products:all');
        await invalidateProductCache(`sellerProducts:${seller}`); // Invalidate seller-specific products
        await invalidateProductCache('search:{}'); // Invalidate default search results
        await invalidateProductCache('featuredProducts');


        const productResponse = new ProductResponseDTO(updatedProduct);
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
        const seller = product.seller;
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
        await invalidateProductCache('products:all'); // Invalidate all products
        await invalidateProductCache(`sellerProducts:${seller}`); // Invalidate seller-specific products
        await invalidateProductCache('search:{}'); // Invalidate default search results

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
            console.log("Cached product found:", cachedProduct);
            return res.status(200).json(cachedProduct);
        }

        const product = await Product.findById(id).populate('seller', '  name email');

        if (!product) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            return next(error);
        }

        const productResponse = new ProductResponseDTO(product);
        await cacheProduct(`products:${id}`, productResponse);
        console.log("Cached product:", productResponse);
        res.status(200).json(productResponse);
    } catch (error) {
        next(error);
    }
};

// Get all products
export const getAllProducts = async (req, res, next) => {
    try {
        res.set('cache-control', 'no-store');
        const cachedProducts = await getCachedProduct('products:all');
        if (cachedProducts) {
            return res.status(200).json(cachedProducts);
        }

        const products = await Product.find().populate('seller', 'name email');

        const productResponse = products.map(product => new ProductResponseDTO(product));
        await cacheProduct('products:all', productResponse);
        console.log("Cached all products:", productResponse);
        res.status(200).json(productResponse);

    } catch (error) {
        next(error);
    }
};

// Search and filter products
export const searchProducts = async (req, res, next) => {
    try {
        const { query, category, minPrice, maxPrice, location, sort, page = 1, limit = 30 } = req.query;

        // Generate a unique cache key based on query parameters
        const cacheKey = `search:${JSON.stringify(req.query)}`;
        const cachedResults = await getCachedProduct(cacheKey);
        if (cachedResults) {
            return res.status(200).json(cachedResults);
        }

        const filter = { deleted: false };
        if (query) {
            filter.name = { $regex: query, $options: 'i' }; // Case-insensitive search
        }
        if (category) {
            filter.category = category;
        }
        if (location) {
            filter.location = location;
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        const sortOptions = {};
        if (sort) {
            const [field, order] = sort.split('-');
            sortOptions[field] = order === 'asc' ? 1 : -1; // 1 for ascending, -1 for descending
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [products, total] = await Promise.all([
            Product.find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(parseInt(limit))
                .populate('seller', 'name email'),
            Product.countDocuments(filter)
        ]);

        const productResponse = products.map(product => new ProductResponseDTO(product));

        const response = {
            products: productResponse,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit))
        };

        // Cache the search results
        await cacheProduct(cacheKey, response);

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

export const getFeaturedProducts = async (req, res, next) => {
    try {
        const cacheKey = 'featuredProducts';
        const cachedProducts = await getCachedProduct(cacheKey);
        if (cachedProducts) {
            return res.status(200).json(cachedProducts);
        }

        const products = await Product.find({ isFeatured: true, deleted: false })
            .populate('seller', 'name email')
            .limit(4)
            .sort({ createdAt: -1 });

        // Cache the fetched products
        await cacheProduct(cacheKey, products);

        res.status(200).json(products.map(p => new ProductResponseDTO(p)));
    } catch (error) {
        next(error);
    }
}

export const getProductsBySeller = async (req, res, next) => {
    try {
        const { sellerId } = req.params;

        // Check if the data is already cached
        const cacheKey = `sellerProducts:${sellerId}`;
        const cachedProducts = await getCachedProduct(cacheKey);
        if (cachedProducts) {
            return res.status(200).json(cachedProducts);
        }

        const products = await Product.find({ seller: sellerId, deleted: false })
            .populate('seller', 'name email')
            .sort({ createdAt: -1 });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for this seller' });
        }

        // Cache the fetched products
        const productResponse = products.map(product => new ProductResponseDTO(product));
        await cacheProduct(cacheKey, productResponse);
        res.status(200).json(productResponse);
    } catch (error) {
        next(error);
    }
}

export const batchGetProducts = async (req, res, next) => {
    try {
        const { productIds } = req.body;

        if (!Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({ message: 'Invalid product IDs' });
        }

        const invalidIds = productIds.filter(id => !mongoose.isValidObjectId(id));
        if (invalidIds.length > 0) {
            return res.status(400).json({ message: 'Invalid product IDs', invalidIds });
        }

        // Check cache for each product ID
        const cachedProducts = await Promise.all(
            productIds.map(async (id) => {
                const cachedProduct = await getCachedProduct(`products:${id}`);
                return cachedProduct ? cachedProduct : null;
            })
        );

        // Filter out null values (products not found in cache)
        const missingProductIds = productIds.filter((id, index) => !cachedProducts[index]);

        // Fetch missing products from the database
        const missingProducts = await Product.find({ _id: { $in: missingProductIds } }).setOptions({ skipDeletedFilter: true });
        console.log('Missing Products:', missingProducts);

        // Cache the missing products
        await Promise.all(
            missingProducts.map((product) => cacheProduct(`products:${product._id}`, product))
        );

        // Combine cached and fetched products
        const allProducts = [...cachedProducts.filter(Boolean), ...missingProducts];

        if (allProducts.length === 0) {
            return res.status(404).json({ message: 'No products found for the provided IDs' });
        }
        console.log('All Products:', allProducts);
        res.status(200).json(allProducts);
    } catch (error) {
        console.error('Error in batchGetProducts:', error);
        next(error);
    }
};