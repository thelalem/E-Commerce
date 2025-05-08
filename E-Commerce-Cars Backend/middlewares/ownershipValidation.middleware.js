export const validateOwnership = (model, field) => async (req, res, next) => {
    try {
        console.log('validating ownership')
        const resource = await model.findById(req.params.id);

        if (!resource) {
            const error = new Error('Resource not found');
            error.statusCode = 404; // Not Found
            return next(error);
        }

        if (resource[field].toString() !== req.user.id) {
            const error = new Error('You do not have permission to access this resource');
            error.statusCode = 403; // Forbidden
            return next(error);
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        error.statusCode = 500; // Internal Server Error
        next(error); // Pass the error to the global error handler
    }
};