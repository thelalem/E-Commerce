export const validateDTO = (DTOClass) => (req, res, next) => {
    const { error } = DTOClass.schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: error.details.map((detail) => detail.message),
        });
    }
    next();
};