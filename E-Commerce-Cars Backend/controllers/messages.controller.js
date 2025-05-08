import Message from '../models/Message.js';

// Send a message to a seller
export const sendMessage = async (req, res, next) => {
    try {
        const { sellerId, productId, message } = req.body;
        const buyerId = req.user._id;

        const newMessage = await Message.create({
            buyer: buyerId,
            seller: sellerId,
            product: productId,
            message,
        });

        res.status(201).json({ message: 'Message sent successfully', newMessage });
    } catch (error) {
        next(error);
    }
};

// Get all messages for the logged-in buyer
export const getBuyerMessages = async (req, res, next) => {
    try {
        const buyerId = req.user._id;
        const messages = await Message.find({ buyer: buyerId }).populate('product seller');
        res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
};

// Get all messages for the logged-in seller
export const getSellerMessages = async (req, res, next) => {
    try {
        const sellerId = req.user._id;
        const messages = await Message.find({ seller: sellerId }).populate('product buyer');
        res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
};