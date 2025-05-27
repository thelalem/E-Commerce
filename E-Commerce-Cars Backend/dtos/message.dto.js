// dtos/message.dto.js
import Joi from 'joi';

export class MessageRequestDTO {
    constructor({ productId, content, senderId, senderName, senderType, recipientId, recipientName }) {
        this.productId = productId;
        this.content = content;
        this.senderId = senderId;
        this.senderName = senderName;
        this.senderType = senderType;
        this.recipientId = recipientId;
        this.recipientName = recipientName;
    }

    static schema = Joi.object({
        productId: Joi.string().required().messages({
            'string.empty': 'Product ID is required.',
        }),
        content: Joi.string().required().messages({
            'string.empty': 'Content is required.',
        }),
        senderId: Joi.string().required(),
        senderName: Joi.string().optional(),
        senderType: Joi.string().valid('seller', 'buyer').required(),
        recipientId: Joi.string().required(),
        recipientName: Joi.string().optional()
    });
}
