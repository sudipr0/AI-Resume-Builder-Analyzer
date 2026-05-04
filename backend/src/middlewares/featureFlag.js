/**
 * Middleware to restrict access to premium features based on user tier.
 */
export const requireFeature = (requiredFeature) => {
  return async (req, res, next) => {
    // In a real application, req.user would be populated by authentication middleware
    const userTier = req.user?.tier || 'free'; 
    
    // Feature matrix mapping features to minimum required tier
    const featureMatrix = {
      'basic_templates': ['free', 'pro', 'business', 'enterprise'],
      'advanced_ats': ['pro', 'business', 'enterprise'],
      'collaboration': ['business', 'enterprise'],
      'sso': ['enterprise'],
      'custom_ai': ['enterprise']
    };

    const allowedTiers = featureMatrix[requiredFeature];

    if (!allowedTiers) {
      return res.status(404).json({ error: 'Unknown feature' });
    }

    if (!allowedTiers.includes(userTier)) {
      return res.status(403).json({ 
        error: `Feature '${requiredFeature}' requires upgrade.`,
        required_tiers: allowedTiers
      });
    }

    next();
  };
};
