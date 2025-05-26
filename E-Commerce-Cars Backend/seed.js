import mongoose from 'mongoose';
import Product from './models/Product.js';
import { mockProducts } from './mockProducts.js';
import { mockUsers } from './mockUsers.js';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();



const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Product.deleteMany({}); // Clear existing products
        const formattedProducts = mockProducts.map(product => ({
            ...product,
            seller: new mongoose.Types.ObjectId('6832fdff62a4b7affaa3daa2'), // Assign the inserted user as the seller
        }));
        await Product.insertMany(formattedProducts); // Insert mock products
        console.log(`${formattedProducts.length} products seeded successfully`);
        mongoose.connection.close();
    }
    catch (error) {
        console.error('Error seeding products:', error);
        mongoose.connection.close();
    }
}

seedProducts();