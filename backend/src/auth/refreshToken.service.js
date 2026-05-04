import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

/**
 * Service to handle secure JWT Refresh Token Rotation.
 * Detects token reuse (stolen token) and revokes the entire token family.
 */
class RefreshTokenService {
  async generateTokenPair(userId) {
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = crypto.randomBytes(40).toString('hex');
    
    // Store refresh token family in Redis (valid for 7 days)
    const key = `refresh_token:${userId}:${refreshToken}`;
    await redis.setex(key, 7 * 24 * 60 * 60, 'active');

    return { accessToken, refreshToken };
  }

  async rotateToken(userId, oldRefreshToken) {
    const key = `refresh_token:${userId}:${oldRefreshToken}`;
    const status = await redis.get(key);

    if (!status) {
      throw new Error('Invalid or expired refresh token');
    }

    if (status === 'used') {
      // SECURITY BREACH DETECTED: Token reuse! Revoke ALL tokens for this user.
      console.warn(`[SECURITY] Token reuse detected for user ${userId}. Revoking all sessions.`);
      await this.revokeAll(userId);
      throw new Error('Security violation: Please log in again');
    }

    // Mark old token as used
    await redis.set(key, 'used');
    
    // Generate new pair
    return await this.generateTokenPair(userId);
  }

  async revokeAll(userId) {
    // Scan and delete all tokens for this user
    let cursor = '0';
    do {
      const result = await redis.scan(cursor, 'MATCH', `refresh_token:${userId}:*`);
      cursor = result[0];
      const keys = result[1];
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== '0');
  }
}

export default new RefreshTokenService();
