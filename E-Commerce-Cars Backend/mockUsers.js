import mongoose from 'mongoose';

export const mockUsers = [
    {
        _id: new mongoose.Types.ObjectId(),
        name: 'Auto Dealer',
        email: 'autodealer@example.com',
        password: 'password123', // This will be hashed when saved
        role: 'seller',
        profilePicture: '',
        address: 'Addis Ababa, Ethiopia',
    },
];
