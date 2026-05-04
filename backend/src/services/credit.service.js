import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

/**
 * Service managing atomic credit operations to prevent race conditions when multiple
 * concurrent AI requests try to deduct credits at the exact same time.
 */
class CreditService {
  /**
   * Deducts credits atomically using Redis Lua scripting.
   * Ensures balance never drops below zero.
   */
  async consumeCredits(userId, amount = 1) {
    const key = `user_credits:${userId}`;
    
    // Lua script: Check balance, if sufficient, deduct. Returns remaining balance or -1.
    const luaScript = `
      local balance = tonumber(redis.call("GET", KEYS[1]) or "0")
      local cost = tonumber(ARGV[1])
      if balance >= cost then
        redis.call("DECRBY", KEYS[1], cost)
        return balance - cost
      else
        return -1
      end
    `;

    const remaining = await redis.eval(luaScript, 1, key, amount);

    if (remaining === -1) {
      throw new Error('Insufficient AI credits. Please upgrade your plan or purchase a credit pack.');
    }

    return remaining;
  }

  /**
   * Adds credits to a user account
   */
  async addCredits(userId, amount) {
    const key = `user_credits:${userId}`;
    const newBalance = await redis.incrby(key, amount);
    return newBalance;
  }

  /**
   * Retrieves current credit balance
   */
  async getBalance(userId) {
    const key = `user_credits:${userId}`;
    const balance = await redis.get(key);
    return parseInt(balance || '0', 10);
  }
}

export default new CreditService();
