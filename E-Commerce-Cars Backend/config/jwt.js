import jwt from 'jsonwebtoken';


export const generateToken = (userId, role) => {
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });
};
export const generateRefreshToken = (userId, role) => {
    return jwt.sign({ id: userId, role }, process.env.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    });
}

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
};