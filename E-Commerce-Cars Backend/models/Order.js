import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
            price: {
                type: Number,
                required: true, // Price of the product at the time of the order
            },
        },
    ],
    totalPrice: {
        type: Number,
        required: true, // Total price of the order (calculated from products)
    },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    deleted: {
        type: Boolean,
        default: false, // Soft deletion flag
    },
    shippingAddress: {
        type: String,
        required: true, // Ensure every order has a shipping address
    },
});

// Query middleware to exclude soft-deleted orders
orderSchema.pre(/^find/, function (next) {
    this.where({ deleted: false });
    next();
});

orderSchema.index({ buyer: 1 });
orderSchema.index({ status: 1 });

export default mongoose.model('Order', orderSchema);