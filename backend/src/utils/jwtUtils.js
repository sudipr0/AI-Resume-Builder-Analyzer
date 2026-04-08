import jwt from 'jsonwebtoken';

// Ensure JWT_SECRET is available — generate a strong fallback for development
const JWT_SECRET = process.env.JWT_SECRET || 'resumecraft-super-secret-jwt-key-2024-dev-only-change-in-prod';

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET not set in environment. Using default dev secret. Set JWT_SECRET in production!');
}

// Generate JWT token
export const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Generate cookie options
export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: (parseInt(process.env.JWT_COOKIE_EXPIRE) || 7) * 24 * 60 * 60 * 1000,
    path: '/'
  };
};
