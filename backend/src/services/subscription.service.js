import Stripe from 'stripe';
import dotenv from 'dotenv';
import creditService from './credit.service.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

/**
 * Service to handle Stripe subscriptions and webhooks
 */
class SubscriptionService {
  /**
   * Handle incoming Stripe webhook events
   */
  async handleWebhook(event) {
    const data = event.data.object;

    switch (event.type) {
      case 'checkout.session.completed':
        await this.processSuccessfulCheckout(data);
        break;
      case 'invoice.payment_succeeded':
        await this.renewSubscription(data);
        break;
      case 'customer.subscription.deleted':
        await this.cancelSubscription(data);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  async processSuccessfulCheckout(session) {
    const userId = session.client_reference_id;
    const customerId = session.customer;
    const subscriptionId = session.subscription;
    
    // Example: Assign 200 AI credits for Pro tier
    const plan = session.metadata?.plan || 'pro';
    let credits = plan === 'pro' ? 200 : plan === 'business' ? 1000 : 0;

    await creditService.addCredits(userId, credits);
    console.log(`User ${userId} subscribed to ${plan} and received ${credits} credits.`);
    
    // In a real app, update User model with customerId and subscriptionId
  }

  async renewSubscription(invoice) {
    // Determine user from invoice.customer
    // Add monthly credits to user account (rolling over max 1 month)
    console.log(`Subscription renewed for customer ${invoice.customer}`);
  }

  async cancelSubscription(subscription) {
    console.log(`Subscription canceled for ${subscription.customer}`);
    // Downgrade user to free tier
  }
}

export default new SubscriptionService();
