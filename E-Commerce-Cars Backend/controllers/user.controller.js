import User from '../models/User.js';
import { UserResponseDTO } from '../dtos/user.dto.js';
import { generateToken } from '../config/jwt.js';
import bcrypt from 'bcryptjs';

// Get user by id
export const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            return next(error);
        }

        const userResponse = new UserResponseDTO(user);
        res.status(200).json(userResponse);
    } catch (err) {
        next(err);
    }
};

// Update user details
export const updateUser = async (req, res, next) => {
    try {
        const { name, email, password, address } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            return next(error);
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.password = password ? await bcrypt.hash(password, 10) : user.password;
        user.address = address || user.address;

        if (req.file) {
            user.profilePicture = `uploads/${req.file.filename}`;
        }

        await user.save();
        const userResponse = new UserResponseDTO(user);
        res.status(200).json(userResponse);
    } catch (err) {
        next(err);
    }
};

// Delete user
export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            return next(error);
        }
        user.deleted = true; // Mark user as deleted
        await user.save(); // Save the changes to the database

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        next(err);
    }
};