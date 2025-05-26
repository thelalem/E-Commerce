import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateRefreshToken, generateToken, verifyRefreshToken } from '../config/jwt.js';
import { UserResponseDTO } from '../dtos/user.dto.js';
import { LoginResponseDTO } from '../dtos/auth.dto.js';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

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
        console.log('refreshToken:', refreshToken); // Log the refresh token for debugging

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
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

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(201).json({ user: userResponse, token });
    } catch (err) {
        next(err);
    }
};


export const refreshToken = async (req, res, next) => {
    const token = req.cookies.refreshToken;
    console.log('Refresh token received:', token); // Log the received token for debugging
    if (!token) {
        const error = new Error('No refresh token provided');
        error.statusCode = 401;
        return next(error);
    }
    try {
        const decoded = verifyRefreshToken(token);
        const accessToken = generateToken(decoded.id, decoded.role);
        console.log('decoded refresh token:', decoded); // Log the decoded token for debugging
        res.json({ token: accessToken });
    } catch (err) {
        const error = new Error('Invalid refresh token');
        error.statusCode = 401;
        return next(error);
    }


};


export const logout = async (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

export const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
        res.json({ user: new UserResponseDTO(user) });
    }
    catch (err) {
        next(err);
    }
};