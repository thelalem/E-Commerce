import Joi from 'joi';

export class FavoriteRequestDTO {
    constructor({ productId }) {
        this.productId = productId;
    }

    static schema = Joi.object({
        productId: Joi.string().required().messages({
            'string.empty': 'Product ID is required.',
        }),
    });
}