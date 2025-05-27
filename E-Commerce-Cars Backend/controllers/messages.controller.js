// controllers/messages.controller.js
import Message from '../models/Message.js';

// Get messages for logged-in user (seller or buyer)
export const getMessagesForUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.query;

        const filter = {
            $or: [{ senderId: userId }, { recipientId: userId }]
        };

        if (productId) {
            filter.productId = productId;
        }


        const messages = await Message.find(filter).sort({ createdAt: 1 })
            .populate('senderId', 'name')
            .populate('recipientId', 'name')
            .populate('productId', 'name');
        console.log('Messages fetched:', messages);
        res.json(messages);
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ message: 'Failed to retrieve messages' });
    }
};

// Send new message
export const sendMessage = async (req, res) => {
    try {
        const message = new Message({
            ...req.body,
            createdAt: new Date()
        });

        await message.save();
        res.status(201).json(message);
    } catch (err) {
        console.error('Error sending message:', err);
        res.status(500).json({ message: 'Failed to send message' });
    }
};
