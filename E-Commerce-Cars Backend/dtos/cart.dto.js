import Joi from 'joi';

export class AddToCartDTO {
    constructor({ productId, quantity }) {
        this.productId = productId;
        this.quantity = quantity;
    }

    static schema = Joi.object({
        productId: Joi.string().required().messages({
            'string.empty': 'Product ID is required.',
        }),
        quantity: Joi.number().min(1).optional().default(1).messages({
            'number.min': 'Quantity must be at least 1.',
        }),
    });
}

export class UpdateCartDTO {
    constructor({ productId, quantity }) {
        this.productId = productId;
        this.quantity = quantity;
    }

    static schema = Joi.object({
        productId: Joi.string().required().messages({
            'string.empty': 'Product ID is required.',
        }),
        quantity: Joi.number().min(1).required().messages({
            'number.min': 'Quantity must be at least 1.',
        }),
    });
}