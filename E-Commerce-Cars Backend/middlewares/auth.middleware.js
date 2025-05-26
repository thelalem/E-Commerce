import { verifyToken } from '../config/jwt.js';
import User from '../models/User.js';

// Middleware to protect routes that require authentication
export const protect = async (req, res, next) => {
    let token;

    try {
        // Check if token is provided in the Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // Extract token from header
            token = req.headers.authorization.split(' ')[1]; // Format: Bearer <token>
        }
        // Check if token is provided in cookies
        else if (req.cookies && req.cookies.refreshToken) {
            token = req.cookies.refreshToken; // Extract token from HttpOnly cookie
        }


        // If no token is found
        if (!token) {
            const error = new Error('Not authorized, no token');
            error.statusCode = 401; // Unauthorized
            return next(error);
        }

        // Verify token
        const decoded = verifyToken(token);

        // If token is invalid or expired
        if (!decoded) {
            const error = new Error('Not authorized, token failed');
            error.statusCode = 401; // Unauthorized
            return next(error);
        }

        // Get user from the decoded token and attach to request
        const user = await User.findById(decoded.id);
        //console.log('Decoded user ID:', user); // Log the decoded user ID for debugging

        if (!user || user.deleted) {
            const error = new Error('Not authorized, user not found or deleted');
            error.statusCode = 401; // Unauthorized
            return next(error);
        }

        req.user = user; // Attach user to request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        err.statusCode = 401; // Unauthorized
        next(err); // Pass the error to the next middleware
    }
};

