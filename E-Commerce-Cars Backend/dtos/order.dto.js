import Joi from 'joi';

// Request DTO for creating or updating an order
export class OrderRequestDTO {
    constructor({ buyer, products, totalPrice, status }) {
        this.buyer = buyer;
        this.products = products;
        this.totalPrice = totalPrice;
        this.status = status;
    }

    static schema = Joi.object({
        products: Joi.array()
            .items(
                Joi.object({
                    product: Joi.string().required().messages({
                        'string.empty': 'Product ID is required.',
                    }),
                    quantity: Joi.number().min(1).required().messages({
                        'number.min': 'Quantity must be at least 1.',
                    }),
                })
            )
            .min(1)
            .required()
            .messages({
                'array.min': 'Products must contain at least one item.',
            }),
    });
}

// Response DTO for returning order data
export class OrderResponseDTO {
    constructor({ _id, buyer, products, totalPrice, status, createdAt }) {
        this.id = _id;
        this.buyer = buyer;
        this.products = products;
        this.totalPrice = totalPrice;
        this.status = status;
        this.createdAt = createdAt;
    }
}