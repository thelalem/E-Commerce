import mongoose from 'mongoose';

export const validateCreateUser = (req, res, next) => {
    const { name, email, password, role } = req.body;

    const errors = [];

    // Validate name
    if (!name || typeof name !== 'string') {
        errors.push({ name: 'Name is required and must be a string.' });
    }

    // Validate email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        errors.push({ email: 'Valid email is required.' });
    }

    // Validate password
    if (!password || password.length < 6) {
        errors.push({ password: 'Password must be at least 6 characters.' });
    }

    // Validate role
    if (role && !['buyer', 'seller'].includes(role)) {
        errors.push({ role: 'Role must be either buyer or seller.' });
    }

    // If there are validation errors, return a 400 response
    if (errors.length > 0) {

        const error = new Error('Validation failed');
        error.statusCode = 400; // Bad Request
        error.errors = errors;
        return next(error);
    }

    next();
};


export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    const errors = [];

    // Validate email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        errors.push({ email: 'Valid email is required.' });
    }

    // Validate password
    if (!password || password.length < 6) {
        errors.push({ password: 'Password must be at least 6 characters.' });
    }

    // If there are validation errors, return a 400 response
    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors });
    }

    next();
};


export const validateOrderRequest = (req, res, next) => {
    const { products, totalPrice, address } = req.body;

    const errors = [];

    // Validate products
    if (!Array.isArray(products) || products.length === 0) {
        errors.push({ products: 'Products are required and must be a non-empty array.' });
    } else {
        products.forEach((product, index) => {
            if (!product.product || !mongoose.Types.ObjectId.isValid(product.product)) {
                errors.push({ [`products[${index}].product`]: 'Product must be a valid ObjectId.' });
            }
            if (!product.quantity || typeof product.quantity !== 'number' || product.quantity <= 0) {
                errors.push({ [`products[${index}].quantity`]: 'Quantity is required and must be a positive number.' });
            }
            if (!product.price || typeof product.price !== 'number' || product.price <= 0) {
                errors.push({ [`products[${index}].price`]: 'Price is required and must be a positive number.' });
            }
        });
    }

    // Validate totalPrice
    if (!totalPrice || typeof totalPrice !== 'number' || totalPrice <= 0) {
        errors.push({ totalPrice: 'Total price is required and must be a positive number.' });
    }

    // Validate address
    if (!address || typeof address !== 'string') {
        errors.push({ address: 'Address is required and must be a string.' });
    }

    // If there are validation errors, return a 400 response
    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors });
    }

    next();
};

export const validateProductRequest = (req, res, next) => {
    const { name, description, price, category, location, imageUrl, stock } = req.body;
    const seller = req.user._id;

    const errors = [];

    // Validate name
    if (!name || typeof name !== 'string' || name.trim() === '') {
        errors.push({ name: 'Name is required and must be a non-empty string.' });
    }

    // Validate description
    if (!description || typeof description !== 'string') {
        errors.push({ description: 'Description is required and must be a string.' });
    }

    // Validate price
    if (!price || typeof price !== 'number' || price < 0) {
        errors.push({ price: 'Price is required and must be a positive number.' });
    }

    // Validate category
    const allowedCategories = ['SUV', 'Sedan', 'Pickup'];
    if (!category || typeof category !== 'string' || !allowedCategories.includes(category)) {
        errors.push({ category: `Category is required and must be one of the following: ${allowedCategories.join(', ')}.` });
    }

    // Validate location
    if (!location || typeof location !== 'string') {
        errors.push({ location: 'Location is required and must be a string.' });
    }

    // Validate imageUrl
    if (!imageUrl || typeof imageUrl !== 'string') {
        errors.push({ imageUrl: 'Image URL is required and must be a string.' });
    }

    // Validate seller
    if (!seller || !mongoose.Types.ObjectId.isValid(seller)) {
        errors.push({ seller: 'Seller is required and must be a valid ObjectId.' });
    }

    // Validate stock
    if (stock === undefined || typeof stock !== 'number' || stock < 0) {
        errors.push({ stock: 'Stock is required and must be a non-negative number.' });
    }

    // If there are validation errors, return a 400 response
    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors });
    }
    console.log('Product request validated successfully');

    next();
};


