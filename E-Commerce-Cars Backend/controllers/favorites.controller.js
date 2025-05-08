import Favorite from '../models/Favorite.js';
import Product from '../models/Product.js';

// Add a product to favorites
export const addFavorite = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const favorite = await Favorite.create({ user: userId, product: productId });
        res.status(201).json({ message: 'Product added to favorites', favorite });
    } catch (error) {
        next(error);
    }
};

// Get all favorite products for the buyer
export const getFavorites = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const favorites = await Favorite.find({ user: userId }).populate('product');
        res.status(200).json(favorites);
    } catch (error) {
        next(error);
    }
};

// Remove a product from favorites
export const removeFavorite = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const favorite = await Favorite.findOneAndDelete({ _id: id, user: userId });
        if (!favorite) {
            return res.status(404).json({ message: 'Favorite not found' });
        }

        res.status(200).json({ message: 'Product removed from favorites' });
    } catch (error) {
        next(error);
    }
};