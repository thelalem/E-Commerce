import User from '../models/User.js';
import { UserResponseDTO } from '../dtos/user.dto.js';
import { generateToken } from '../config/jwt.js';
import bycrypt from 'bcryptjs';

// Get user by id
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userResponse = new UserResponseDTO(
            user._id,
            user.name,
            user.email,
            user.role,
            user.profilePicture,
            user.address,
            user.createdAt,
            user.updatedAt
        );
        res.status(200).json(userResponse);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};


//Update user details
export const updateUser = async (req, res) => {
    try {
        const { name, email, password, profilePicture, address } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.password = password ? await bycrypt.hash(password, 10) : user.password;
        user.profilePicture = profilePicture || user.profilePicture;
        user.address = address || user.address;

        await user.save();
        const userResponse = new UserResponseDTO(
            user._id,
            user.name,
            user.email,
            user.role,
            user.profilePicture,
            user.address,
            user.createdAt,
            user.updatedAt
        );
        res.status(200).json(userResponse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

//Delete user

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.deleted = true; // Mark user as deleted
        await user.save(); // Save the changes to the database

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};