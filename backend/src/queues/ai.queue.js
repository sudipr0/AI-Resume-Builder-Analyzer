import { Queue } from 'bullmq';
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Standard Redis connection for BullMQ
const redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

/**
 * BullMQ Queue for handling AI text generation and analysis tasks asynchronously.
 * This prevents blocking the main thread during heavy LLM operations.
 */
export const aiQueue = new Queue('ai-processing-queue', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true, // Keep Redis memory clean
    removeOnFail: false, // Keep failed jobs for debugging
  },
});

/**
 * Helper to add a job to the AI queue
 * @param {string} jobId Unique identifier for the job
 * @param {Object} data The payload containing prompt, user details, etc.
 * @returns {Promise<import('bullmq').Job>}
 */
export const enqueueAiTask = async (jobId, data) => {
  return await aiQueue.add('process-ai-task', data, {
    jobId,
  });
};
