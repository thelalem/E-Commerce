import Joi from 'joi';

// Request DTO for creating or updating a product
export class ProductRequestDTO {
    constructor({ name, description, price, category, location, imageUrl, seller, stock }) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.location = location;
        this.imageUrl = imageUrl;
        this.seller = seller;
        this.stock = stock;
    }

    static schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Name is required and must be a string.',
        }),
        description: Joi.string().required().messages({
            'string.empty': 'Description is required and must be a string.',
        }),
        price: Joi.number().min(0).required().messages({
            'number.min': 'Price must be a positive number.',
        }),
        category: Joi.string().valid('SUV', 'Sedan', 'Pickup').required().messages({
            'any.only': 'Category must be one of SUV, Sedan, or Pickup.',
        }),
        location: Joi.string().required().messages({
            'string.empty': 'Location is required and must be a string.',
        }),
        imageUrl: Joi.string().required().messages({
            'string.empty': 'Image URL is required and must be a string.',
        }),
        seller: Joi.string().optional(),
        stock: Joi.number().min(0).required().messages({
            'number.min': 'Stock must be a non-negative number.',
        }),
    });
}

// Response DTO for returning product data
export class ProductResponseDTO {
    constructor({ _id, name, description, price, category, location, imageUrl, seller, stock, createdAt }) {
        this.id = _id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.location = location;
        this.imageUrl = imageUrl;
        this.seller = seller;
        this.stock = stock;
        this.createdAt = createdAt;
    }
}
