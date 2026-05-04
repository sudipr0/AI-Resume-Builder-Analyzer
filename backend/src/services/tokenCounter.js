/**
 * A heuristic-based token counter to estimate token usage before sending to OpenAI/Groq,
 * helping to prevent unexpected billing spikes or payload too large errors.
 */

class TokenCounter {
  /**
   * Estimates tokens based on the average of 4 chars per token for English text.
   * For highly accurate counting, use the 'tiktoken' library.
   * @param {string} text 
   * @returns {number} Estimated token count
   */
  estimateTokens(text) {
    if (!text) return 0;
    // 1 token ~= 4 chars in English
    // Also consider word boundaries for a slightly better heuristic
    const charBasedEstimate = text.length / 4;
    const wordBasedEstimate = text.split(/\s+/).length * 1.33;
    
    return Math.ceil((charBasedEstimate + wordBasedEstimate) / 2);
  }

  /**
   * Calculates the estimated cost of a prompt.
   * @param {string} text 
   * @param {string} model 
   * @returns {number} Estimated cost in USD
   */
  estimateCost(text, model = 'gpt-4o-mini') {
    const tokens = this.estimateTokens(text);
    
    const pricing = {
      'gpt-4o-mini': { input: 0.150 / 1000000 },
      'gpt-4o': { input: 5.00 / 1000000 },
      'llama3-8b-8192': { input: 0.05 / 1000000 } // Groq example
    };

    const rate = pricing[model]?.input || pricing['gpt-4o-mini'].input;
    return tokens * rate;
  }
}

export default new TokenCounter();
