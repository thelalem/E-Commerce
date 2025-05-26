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

        const existingFavorite = await Favorite.findOne({ user: userId, product: productId });
        if (existingFavorite) {
            return res.status(400).json({ message: 'Product is already in favorites' });
        }

        await Favorite.create({ user: userId, product: productId });

        const favorites = await Favorite.findOne({ user: userId, product: productId }).populate('product');
        res.status(201).json({ message: 'Product added to favorites', favorites });
    } catch (error) {
        next(error);
    }
}
    ;

// Get all favorite products for the buyer
export const getFavorites = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const favorites = await Favorite.find({ user: userId }).populate('product');
        console.log("Ive been called", favorites);
        res.status(200).json({ favorites });
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
        const favorites = await Favorite.find({ user: userId }).populate('product');
        res.status(200).json({ message: 'Product removed from favorites', favorites });
    } catch (error) {
        next(error);
    }
};