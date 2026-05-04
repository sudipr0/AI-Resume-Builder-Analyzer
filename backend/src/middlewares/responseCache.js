import Redis from 'ioredis';
import crypto from 'crypto';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

/**
 * Middleware for caching standard API responses (like templates or static lists).
 * Helps achieve <1s response times for frequently requested non-user-specific data.
 */
export const responseCache = (durationInSeconds = 3600) => {
  return async (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `express_cache:${req.originalUrl}`;
    
    try {
      const cachedResponse = await redis.get(key);
      if (cachedResponse) {
        return res.json(JSON.parse(cachedResponse));
      } else {
        // Intercept res.json to cache the output before sending
        res.sendResponse = res.json;
        res.json = (body) => {
          redis.setex(key, durationInSeconds, JSON.stringify(body));
          res.sendResponse(body);
        };
        next();
      }
    } catch (err) {
      console.error('Redis cache error:', err);
      next(); // Fail open if Redis is down
    }
  };
};
