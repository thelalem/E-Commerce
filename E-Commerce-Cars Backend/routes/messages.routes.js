import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { validateDTO } from '../middlewares/validation.middleware.js';
import { MessageRequestDTO } from '../dtos/message.dto.js';
import { sendMessage, getBuyerMessages, getSellerMessages } from '../controllers/messages.controller.js';

const router = express.Router();

router.post('/', protect, validateDTO(MessageRequestDTO), sendMessage);
router.get('/buyer', protect, getBuyerMessages);
router.get('/seller', protect, getSellerMessages);

export default router;