import { verifyToken } from '../config/jwt.js';
import User from '../models/User.js';

// Middleware to protect routes that require authentication
export const protect = async (req, res, next) => {
    let token;

    // Check if token is provided in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from header
            token = req.headers.authorization.split(' ')[1]; // Format: Bearer <token>

            // Verify token
            const decoded = verifyToken(token);

            // If token is invalid or expired
            if (!decoded) {
                return res.status(401).json({ message: 'Not authorized, token failed' });
            }

            // Get user from the decoded token and attach to request
            const user = await User.findById(decoded.userId);

            if (!user || user.deleted) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            req.user = user; // Attach user to request object

            next(); // Proceed to the next middleware or route handler
        } catch (err) {
            console.error(err);
            res.status(401).json({ message: 'Not authorized, token error' });
        }
    }
    else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }


};

