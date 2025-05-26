import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const getCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', '_id name price imageUrl');

        if (!cart || cart.items.length === 0) {
            return res.status(200).json({ cartItems: [] });
        }

        const cartItems = cart.items.map((item) => ({
            _id: item._id,
            product: {
                _id: item.product._id,
                name: item.product.name,
                price: item.product.price,
                imageUrl: item.product.imageUrl,
            },
            quantity: item.quantity,
        }));

        res.status(200).json({ cartItems });
    } catch (error) {
        next(error);
    }
};

export const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity = 1 } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        const existingItem = cart.items.find((item) => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();

        const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product', '_id name price imageUrl');

        const cartItems = updatedCart.items.map((item) => ({
            _id: item._id,
            product: {
                _id: item.product._id,
                name: item.product.name,
                price: item.product.price,
                imageUrl: item.product.imageUrl,
            },
            quantity: item.quantity,
        }));

        res.status(200).json({ cartItems });
    } catch (error) {
        next(error);
    }
};

export const removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        await cart.save();

        const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product', '_id name price imageUrl');

        const cartItems = updatedCart.items.map((item) => ({
            _id: item._id,
            product: {
                _id: item.product._id,
                name: item.product.name,
                price: item.product.price,
                imageUrl: item.product.imageUrl,
            },
            quantity: item.quantity,
        }));

        res.status(200).json({ cartItems });
    } catch (error) {
        next(error);
    }
};

export const updateCartQuantity = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find((item) => item.product.toString() === productId);
        if (!item) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        item.quantity = quantity;
        await cart.save();

        const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product', '_id name price imageUrl');

        const cartItems = updatedCart.items.map((item) => ({
            _id: item._id,
            product: {
                _id: item.product._id,
                name: item.product.name,
                price: item.product.price,
                imageUrl: item.product.imageUrl,
            },
            quantity: item.quantity,
        }));

        res.status(200).json({ cartItems });
    } catch (error) {
        next(error);
    }
};

export const clearCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({ cartItems: [] });
    } catch (error) {
        next(error);
    }
};