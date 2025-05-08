import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../config/jwt.js';
import { UserResponseDTO } from '../dtos/user.dto.js';
import { LoginResponseDTO } from '../dtos/auth.dto.js';

export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error('Invalid email or password');
            error.statusCode = 400;
            return next(error);
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            const error = new Error('Invalid email or password');
            error.statusCode = 400;
            return next(error);
        }
        const token = generateToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id, user.role);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        const loginResponse = new LoginResponseDTO({
            token,
            user: new UserResponseDTO(user),
        });

        res.status(200).json(loginResponse);
    } catch (err) {
        next(err);
    }
};

// Register a new user
export const createUser = async (req, res, next) => {
    console.log('Request body:', req.body); // Log the request body for debugging
    try {
        const { name, email, password, role, profilePicture, address } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 400;
            return next(error);
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
        const token = generateToken(newUser._id, newUser.role);
        const refreshToken = generateRefreshToken(newUser._id, newUser.role);

        const userResponse = new UserResponseDTO(newUser);
        res.status(201).json({ user: userResponse, token });
    } catch (err) {
        next(err);
    }
};


export const refreshToken = async (req, res, next) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        const error = new Error('No refresh token provided');
        error.statusCode = 401;
        return next(error);
    }
    jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            const error = new Error('Invalid refresh token');
            error.statusCode = 401;
            return next(error);
        }
        const accessToken = generateToken(decoded.id, decoded.role);
        res.json({ token: accessToken });
    });

};


export const logout = async (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    res.status(200).json({ message: 'Logged out successfully' });
};