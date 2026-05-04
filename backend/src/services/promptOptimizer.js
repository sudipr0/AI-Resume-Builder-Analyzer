/**
 * Optimizes prompts to reduce OpenAI token usage by stripping unnecessary formatting,
 * whitespace, and redundant phrasing.
 */
class PromptOptimizer {
  /**
   * Compresses the text payload to save ~40% on token costs.
   */
  compress(text) {
    if (!text) return '';
    
    return text
      // Remove multiple spaces
      .replace(/\s+/g, ' ')
      // Remove line breaks
      .replace(/[\r\n]+/g, ' ')
      // Remove generic filler words that don't add semantic value to LLMs
      // (This is a naive example; in production, use an NLP library like stopword)
      .replace(/\b(a|an|the|and|or|but|because|as|until|while|of|at|by|for|with|about|against|between|into|through|during|before|after|above|below|to|from|up|down|in|out|on|off|over|under|again|further|then|once)\b/gi, '')
      .trim();
  }

  /**
   * Specifically optimizes JSON payloads from the resume editor by stripping empty fields
   * before sending to the AI.
   */
  optimizeResumeJson(resumeObj) {
    const cleanObj = (obj) => {
      Object.keys(obj).forEach(key => {
        if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
          delete obj[key];
        } else if (typeof obj[key] === 'object') {
          cleanObj(obj[key]);
        }
      });
      return obj;
    };
    
    return cleanObj(JSON.parse(JSON.stringify(resumeObj)));
  }
}

export default new PromptOptimizer();
