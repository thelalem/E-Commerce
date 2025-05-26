import mongoose from "mongoose";

async function updateImageUrls() {
    try {
        // Wait for the connection to be established
        await mongoose.connect('mongodb://localhost:27017/ecommerce-cars');
        const db = mongoose.connection.db;

        const cars = await db.collection('products').find().toArray();

        for (const car of cars) {
            const imageUrl = car.imageUrl;
            if (imageUrl) {
                const imageName = imageUrl.split('/').pop(); // Extract the name from the URL
                const updatedImageUrl = `uploads/${imageName}`; // Prepend /uploads/
                await db.collection('products').updateOne(
                    { _id: car._id },
                    { $set: { imageUrl: updatedImageUrl } }
                );
            };
        }

        console.log('All imageUrl fields have been updated.');
    } catch (error) {
        console.error('Error updating imageUrl fields:', error);
    } finally {
        mongoose.connection.close();
    }
}

updateImageUrls();
