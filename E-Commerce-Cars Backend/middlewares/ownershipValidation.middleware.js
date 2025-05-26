import mongoose from 'mongoose';

export const validateOwnership = (model, field) => async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            const error = new Error('Invalid resource ID');
            error.statusCode = 400; // Bad Request
            return next(error);
        }

        const resource = await model.findById(req.params.id);

        if (!resource) {
            const error = new Error('Resource not found');
            error.statusCode = 404; // Not Found
            return next(error);
        }

        if (Array.isArray(resource[field])) {
            // If the field is an array (e.g., products), check if the seller owns any of them
            const isOwner = resource[field].some((item) => item.toString() === req.user.id);
            if (!isOwner) {
                const error = new Error('You do not have permission to access this resource');
                error.statusCode = 403; // Forbidden
                return next(error);
            }
        } else {
            // For single ownership validation
            if (resource[field].toString() !== req.user.id) {
                const error = new Error('You do not have permission to access this resource');
                error.statusCode = 403; // Forbidden
                return next(error);
            }
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        error.statusCode = 500; // Internal Server Error
        next(error); // Pass the error to the global error handler
    }
};