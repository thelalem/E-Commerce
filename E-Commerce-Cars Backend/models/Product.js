import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price must be a positive number'],
        },
        category: {
            type: String,
            enum: ['SUV', 'Sedan', 'Pickup'], // Allowed categories
            required: [true, 'Product category is required'],
        },
        location: {
            type: String,
            required: [true, 'Product location is required'],
        },
        imageUrl: {
            type: String,
            required: [true, 'Product image URL is required'],
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Seller is required'],
        },
        stock: {
            type: Number,
            required: [true, 'Product stock is required'],
            min: [0, 'Stock must be a positive number'],
            default: 0,
        },
        deleted: {
            type: Boolean,
            default: false, // Soft deletion flag
        },
        isFeatured: {
            type: Boolean,
            default: false, // Flag to mark featured products
        }
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

// Query middleware to exclude soft-deleted products
productSchema.pre(/^find/, function (next) {
    this.where({ deleted: false });
    next();
});
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
const Product = mongoose.model('Product', productSchema);

export default Product;