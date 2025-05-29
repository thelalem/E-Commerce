import Joi from 'joi';

// Request DTO for creating or updating an order
export class OrderRequestDTO {
    constructor({ buyer, products, totalPrice, status, shippingAddress }) {
        this.buyer = buyer;
        this.products = products;
        this.totalPrice = totalPrice;
        this.status = status;
        this.shippingAddress = shippingAddress; // Add shippingAddress
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
        status: Joi.string()
            .valid('pending', 'shipped', 'delivered', 'cancelled')
            .optional()
            .messages({
                'any.only': 'Status must be one of pending, shipped, delivered, or cancelled.',
            }),
        shippingAddress: Joi.string().required().messages({
            'string.empty': 'Shipping address is required.',
            'any.required': 'Shipping address is required.',
        }), // Add validation for shippingAddress
    });
}

// Response DTO for returning order data
export class OrderResponseDTO {
    constructor({ _id, buyer, products, totalPrice, status, createdAt, shippingAddress }) {
        this.id = _id;
        this.buyer = buyer && {
            id: buyer._id?.toString() || buyer.id,
            name: buyer.name,
            email: buyer.email,
        }
        this.products = Array.isArray(products)
            ? products.map(({ product, quantity, price }) => ({
                product: product && {
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    description: product.description,
                    seller: product.seller && {
                        id: product.seller._id,
                        name: product.seller.name,
                        email: product.seller.email,
                    },
                },
                quantity,
                price,
            }))
            : [];
        this.totalPrice = totalPrice;
        this.status = status;
        this.createdAt = createdAt;
        this.shippingAddress = shippingAddress; // Add shippingAddress
    }
}