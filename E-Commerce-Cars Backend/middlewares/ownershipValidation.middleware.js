export const validateOwnership = (model, field) => async (req, res, next) => {
    try {
        const resource = await model.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        if (resource[field].toString() !== req.user.id) {
            return res.status(403).json({ message: 'You do not have permission to access this resource' });
        }
        next();
    } catch (error) {
        console.error('Error validating ownership:', error);
        res.status(500).json({ message: 'Server error' });
    }
}