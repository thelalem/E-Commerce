// routes/messages.routes.js
import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { validateDTO } from '../middlewares/validation.middleware.js';
import { MessageRequestDTO } from '../dtos/message.dto.js';
import {
    sendMessage,
    getMessagesForUser
} from '../controllers/messages.controller.js';

const router = express.Router();

// Get all messages for current user
router.get('/', protect, getMessagesForUser);

// Send a new message
router.post(
    '/',
    protect,
    validateDTO(MessageRequestDTO),
    sendMessage
);

export default router;
