import Joi from 'joi';

export class MessageRequestDTO {
    constructor({ sellerId, productId, message }) {
        this.sellerId = sellerId;
        this.productId = productId;
        this.message = message;
    }

    static schema = Joi.object({
        sellerId: Joi.string().required().messages({
            'string.empty': 'Seller ID is required.',
        }),
        productId: Joi.string().required().messages({
            'string.empty': 'Product ID is required.',
        }),
        message: Joi.string().required().messages({
            'string.empty': 'Message is required.',
        }),
    });
}