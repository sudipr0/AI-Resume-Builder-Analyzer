import { PostHog } from 'posthog-node';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Service for tracking user events and resume analytics
 */
class AnalyticsService {
  constructor() {
    this.client = null;
    const apiKey = process.env.POSTHOG_API_KEY;
    
    if (apiKey) {
      this.client = new PostHog(apiKey, {
        host: process.env.POSTHOG_HOST || 'https://app.posthog.com'
      });
    } else {
      console.warn('POSTHOG_API_KEY not set. Analytics will be logged to console.');
    }
  }

  /**
   * Tracks a custom event
   */
  track(event, distinctId, properties = {}) {
    if (this.client) {
      this.client.capture({
        distinctId,
        event,
        properties
      });
    } else {
      console.log(`[Analytics Mock] Event: ${event} | User: ${distinctId} | Props:`, properties);
    }
  }

  /**
   * Identifies a user to tie events to their profile
   */
  identifyUser(userId, traits = {}) {
    if (this.client) {
      this.client.identify({
        distinctId: userId,
        properties: traits
      });
    }
  }

  /**
   * Flush events before shutdown
   */
  async shutdown() {
    if (this.client) {
      await this.client.shutdown();
    }
  }
}

export default new AnalyticsService();
