import React, { useState } from 'react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    features: ['5 resumes', '10 AI uses/month', 'Basic templates'],
    buttonText: 'Current Plan',
    tier: 'free'
  },
  {
    name: 'Pro',
    price: '$19/mo',
    features: ['Unlimited resumes', '200 AI uses', 'Advanced ATS Scoring', 'Cover Letter Generation'],
    buttonText: 'Upgrade to Pro',
    tier: 'pro',
    popular: true
  },
  {
    name: 'Business',
    price: '$49/mo',
    features: ['5 team seats', '1000 AI uses', 'Real-time Collaboration', 'Analytics Dashboard'],
    buttonText: 'Upgrade to Business',
    tier: 'business'
  }
];

export const PricingPlans: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (tier: string) => {
    setLoading(tier);
    try {
      // Typically you'd call your backend here to get a Stripe Checkout URL or Esewa details
      const response = await fetch(`/api/checkout/create-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier })
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
      }
    } catch (err) {
      console.error('Checkout failed', err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="py-12 bg-gray-50 flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold mb-8">Choose Your AI Power Level</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {plans.map((plan) => (
          <div key={plan.name} className={`relative p-8 border rounded-xl bg-white shadow-sm flex flex-col ${plan.popular ? 'border-blue-500 shadow-md ring-1 ring-blue-500' : 'border-gray-200'}`}>
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-3 py-1 text-xs font-bold rounded-full">
                MOST POPULAR
              </span>
            )}
            <h3 className="text-xl font-semibold text-gray-800">{plan.name}</h3>
            <p className="mt-4 text-4xl font-extrabold">{plan.price}</p>
            <ul className="mt-8 space-y-4 flex-1">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-sm text-gray-600">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleCheckout(plan.tier)}
              disabled={plan.tier === 'free' || loading === plan.tier}
              className={`mt-8 w-full py-3 px-4 rounded-lg font-medium transition-colors ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'} ${plan.tier === 'free' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading === plan.tier ? 'Loading...' : plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
