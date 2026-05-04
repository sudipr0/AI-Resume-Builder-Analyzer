import crypto from 'crypto';
import creditService from '../services/credit.service.js';

/**
 * Handles Esewa payment callbacks for users in Nepal
 */
export const handleEsewaSuccess = async (req, res) => {
  try {
    // Esewa sends back query parameters on success: oid, amt, refId
    const { oid, amt, refId } = req.query;

    if (!oid || !amt || !refId) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }

    // In a real scenario, you MUST verify the payment with Esewa's verification API using refId and amt.
    // Example: fetch(`https://uat.esewa.com.np/epay/transrec?amt=${amt}&scd=EPAYTEST&pid=${oid}&rid=${refId}`)
    const isVerified = true; // Assume verification passed for this demo

    if (isVerified) {
      // Decode oid to get user ID and plan. Format might be: "user_123-pro_plan-timestamp"
      const parts = oid.split('-');
      const userId = parts[0];
      const plan = parts[1];

      let credits = plan === 'pro' ? 200 : plan === 'business' ? 1000 : 0;
      await creditService.addCredits(userId, credits);

      console.log(`Esewa payment successful. User ${userId} upgraded to ${plan}.`);
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard?payment=success`);
    } else {
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard?payment=failed`);
    }

  } catch (error) {
    console.error('Esewa handler error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
