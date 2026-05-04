export class BulletEnhancer {
  /**
   * Identifies weak bullet points and generates metrics-driven alternatives.
   */
  public enhanceBullets(bullets: string[]): { original: string, suggestions: string[] }[] {
    return bullets.map(bullet => {
      const hasNumbers = /\d/.test(bullet);
      const suggestions = [];

      if (!hasNumbers) {
        suggestions.push(
          `Quantify this: e.g., "${bullet} resulting in a 20% increase in efficiency."`
        );
        suggestions.push(
          `Add scale: e.g., "Managed a team of 5 to ${bullet.toLowerCase()}."`
        );
      } else {
        suggestions.push("Strong bullet point! Contains quantitative metrics.");
      }

      // Add action verb check
      const weakVerbs = ['helped', 'worked', 'did', 'was responsible for'];
      const startsWithWeakVerb = weakVerbs.some(v => bullet.toLowerCase().startsWith(v));
      
      if (startsWithWeakVerb) {
        suggestions.push("Start with a stronger action verb like 'Spearheaded', 'Orchestrated', or 'Engineered'.");
      }

      return {
        original: bullet,
        suggestions
      };
    });
  }
}
