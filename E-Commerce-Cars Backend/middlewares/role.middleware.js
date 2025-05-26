export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        try {
            // console.log("Authorizing roles");
            // console.log(req.user.role)
            if (!roles.includes(req.user.role)) {
                const error = new Error(`Role: ${req.user.role} is not allowed to access this resource`);
                error.statusCode = 403; // Forbidden
                return next(error);
            }
            //console.log("authorization complete", req.user);
            next();
        } catch (error) {
            next(error);
        }
    }
}   