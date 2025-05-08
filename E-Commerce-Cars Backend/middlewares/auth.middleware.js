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


            // Verify token
            const decoded = verifyToken(token);


            // If token is invalid or expired
            if (!decoded) {
                const error = new Error('not authorized, token failed');
                error.statusCode = 401; // Unauthorized
                return next(error);
            }
            // Get user from the decoded token and attach to request
            const user = await User.findById(decoded.id);


            if (!user || user.deleted) {
                const error = new Error('not authorized, user not found or deleted');
                error.statusCode = 401; // Unauthorized
                return next(error);
            }

            req.user = user; // Attach user to request object
            console.log('user authenticated', req.user)

            next(); // Proceed to the next middleware or route handler
        }
        else {
            const error = new Error('not authorized, no token');
            error.statusCode = 401; // Unauthorized
            return next(error);
        }
    } catch (err) {
        err.statusCode = 401; // Unauthorized
        next(err); // Pass the error to the next middleware

    }


};

