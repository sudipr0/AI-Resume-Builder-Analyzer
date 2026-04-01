// utils/jwtToken.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key-change-this';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET || 'your-jwt-secret-key-change-this';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    return jwt.sign(
        { userId },
        secret,
        { expiresIn }
    );
};

export const verifyToken = (token) => {
    try {
        const secret = process.env.JWT_SECRET || 'your-jwt-secret-key-change-this';
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
};

export const generateAuthTokens = (user) => {
    const secret = process.env.JWT_SECRET || 'your-jwt-secret-key-change-this';
    const accessToken = generateToken(user._id);
    const refreshToken = jwt.sign(
        { userId: user._id, type: 'refresh' },
        secret,
        { expiresIn: '30d' }
    );

    return { accessToken, refreshToken };
};