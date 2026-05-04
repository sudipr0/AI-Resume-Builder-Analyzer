export class KeywordGapDetector {
  /**
   * Compares a job description with a resume to identify skill gaps.
   * @param resumeText Extracted text from the user's resume
   * @param jobDescriptionText The target job description
   * @returns Array of missing skills/keywords
   */
  public detectGaps(resumeText: string, jobDescriptionText: string): { keyword: string, importance: 'high' | 'medium' | 'low' }[] {
    // In a real scenario, this would use a spaCy/NLP model or LLM to extract entities
    const commonSkills = ['React', 'Node.js', 'Python', 'Docker', 'AWS', 'SQL', 'TypeScript', 'Kubernetes'];
    const gaps: { keyword: string, importance: 'high' | 'medium' | 'low' }[] = [];

    const resumeLower = resumeText.toLowerCase();
    const jdLower = jobDescriptionText.toLowerCase();

    commonSkills.forEach(skill => {
      const skillLower = skill.toLowerCase();
      const inJd = jdLower.includes(skillLower);
      const inResume = resumeLower.includes(skillLower);

      if (inJd && !inResume) {
        // Simple heuristic: if mentioned multiple times in JD, it's high importance
        const countInJd = (jdLower.match(new RegExp(skillLower, 'g')) || []).length;
        let importance: 'high' | 'medium' | 'low' = 'low';
        if (countInJd > 2) importance = 'high';
        else if (countInJd === 2) importance = 'medium';

        gaps.push({ keyword: skill, importance });
      }
    });

    return gaps.sort((a, b) => a.importance === 'high' ? -1 : 1);
  }
}
