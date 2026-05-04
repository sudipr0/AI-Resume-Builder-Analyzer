/**
 * Security middleware to detect and prevent AI prompt injection attacks.
 */
export const promptSanitizer = (req, res, next) => {
  if (!req.body || !req.body.prompt) {
    return next();
  }

  const userPrompt = req.body.prompt.toLowerCase();

  // Known injection phrases
  const blocklist = [
    'ignore all previous instructions',
    'system prompt',
    'you are now',
    'forget your instructions',
    'developer mode',
    'do not follow',
    'print your initial instructions'
  ];

  const hasInjection = blocklist.some(phrase => userPrompt.includes(phrase));

  if (hasInjection) {
    console.warn(`[SECURITY] Prompt injection blocked from IP ${req.ip}`);
    return res.status(403).json({
      error: 'Invalid input. Request blocked by security policies.'
    });
  }

  // Basic sanitization
  req.body.prompt = req.body.prompt
    .replace(/[<>]/g, '') // strip potential HTML/XSS
    .trim();

  next();
};
