import Redis from 'ioredis';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

/**
 * Service for caching AI responses to reduce API costs and response times.
 */
class CacheService {
  /**
   * Generate a stable hash for a prompt to use as a cache key.
   * @param {string} prompt 
   * @param {string} systemPrompt 
   * @returns {string}
   */
  generateKey(prompt, systemPrompt) {
    const data = JSON.stringify({ prompt, systemPrompt });
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Get cached AI response if it exists
   * @param {string} prompt 
   * @param {string} systemPrompt 
   * @returns {Promise<string|null>}
   */
  async getCachedResponse(prompt, systemPrompt) {
    const key = `ai-cache:${this.generateKey(prompt, systemPrompt)}`;
    const result = await redis.get(key);
    return result ? JSON.parse(result) : null;
  }

  /**
   * Store AI response in cache for 24 hours
   * @param {string} prompt 
   * @param {string} systemPrompt 
   * @param {string} response 
   * @param {number} ttlInSeconds Default 24h
   */
  async setCachedResponse(prompt, systemPrompt, response, ttlInSeconds = 86400) {
    const key = `ai-cache:${this.generateKey(prompt, systemPrompt)}`;
    await redis.setex(key, ttlInSeconds, JSON.stringify(response));
  }
}

export default new CacheService();
