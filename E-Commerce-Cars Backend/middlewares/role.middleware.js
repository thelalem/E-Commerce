export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        try {
            if (!roles.includes(req.user.role)) {
                const error = new Error(`Role: ${req.user.role} is not allowed to access this resource`);
                error.statusCode = 403; // Forbidden
                return
            }
            next();
        } catch (error) {
            next(error);
        }
    }
}   