import { Worker } from 'bullmq';
import Redis from 'ioredis';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Background worker that processes AI tasks off the queue.
 * It connects to OpenAI, gets the response, and can emit progress for streaming.
 */
export const aiWorker = new Worker(
  'ai-processing-queue',
  async (job) => {
    const { prompt, systemPrompt, model = 'gpt-4o-mini', temperature = 0.7 } = job.data;
    
    // Announce start
    await job.updateProgress({ status: 'starting', percentage: 0 });

    try {
      // Simulate chunking/streaming via progress updates
      // In a real scenario, you'd use openai.chat.completions.create with stream: true
      // and iterate over chunks, updating Redis or PubSub so SSE can stream to client.
      
      const response = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt || 'You are an expert resume writer.' },
          { role: 'user', content: prompt }
        ],
        temperature,
        stream: true,
      });

      let fullResponse = '';
      
      // We push chunks to a pub/sub channel for SSE to pick up
      const streamChannel = `ai-stream-${job.id}`;

      for await (const chunk of response) {
        const text = chunk.choices[0]?.delta?.content || '';
        if (text) {
          fullResponse += text;
          // Publish partial updates to Redis for SSE consumers
          await redisConnection.publish(streamChannel, JSON.stringify({ chunk: text }));
        }
      }

      await job.updateProgress({ status: 'completed', percentage: 100 });
      
      // Notify stream end
      await redisConnection.publish(streamChannel, JSON.stringify({ done: true }));

      return { success: true, result: fullResponse };
      
    } catch (error) {
      console.error(`AI Worker failed for job ${job.id}:`, error);
      throw error; // Will be retried automatically by BullMQ
    }
  },
  { connection: redisConnection }
);

aiWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error ${err.message}`);
});
