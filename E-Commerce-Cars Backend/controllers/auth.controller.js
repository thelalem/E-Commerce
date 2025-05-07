import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../config/jwt.js';
import { UserResponseDTO } from '../dtos/user.dto.js';
import { LoginResponseDTO } from '../dtos/auth.dto.js';

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = generateToken(user._id);
        const loginResponse = new LoginResponseDTO({
            token,
            user: new UserResponseDTO(user),
        });

        res.status(200).json(loginResponse);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Register a new user
export const createUser = async (req, res) => {
    console.log('Request body:', req.body); // Log the request body for debugging
    try {
        const { name, email, password, role, profilePicture, address } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({
            name,
            email,
            password,
            role,
            profilePicture,
            address
        });

        await newUser.save();
        const token = generateToken(newUser._id);

        const userResponse = new UserResponseDTO(newUser);
        res.status(201).json({ user: userResponse, token });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


