export interface SectionScore {
  section: string;
  score: number;
  feedback: string[];
}

export interface ATSResult {
  globalScore: number;
  sections: SectionScore[];
  missingKeywords: string[];
}

/**
 * AI Agent responsible for grading a resume purely from an ATS parsing perspective.
 */
export class ATSScorer {
  /**
   * Calculates ATS score based on structural elements and content.
   */
  public analyzeResume(resumeText: string, jobDescription?: string): ATSResult {
    const sections: SectionScore[] = [];
    let globalScore = 100;
    
    // Simulate section parsing logic
    const hasExperience = resumeText.toLowerCase().includes('experience');
    const hasEducation = resumeText.toLowerCase().includes('education');
    const hasSkills = resumeText.toLowerCase().includes('skills');

    sections.push({
      section: 'Experience',
      score: hasExperience ? 90 : 20,
      feedback: hasExperience ? ['Good detail'] : ['Missing experience section'],
    });

    sections.push({
      section: 'Education',
      score: hasEducation ? 100 : 0,
      feedback: hasEducation ? ['Education present'] : ['Education section missing'],
    });

    // Deduct from global if sections are missing
    if (!hasExperience) globalScore -= 30;
    if (!hasEducation) globalScore -= 10;
    if (!hasSkills) globalScore -= 10;

    return {
      globalScore,
      sections,
      missingKeywords: jobDescription ? this.extractMissingKeywords(resumeText, jobDescription) : [],
    };
  }

  private extractMissingKeywords(resume: string, jd: string): string[] {
    // Basic implementation of keyword matching (would be enhanced by NLP/LLM)
    const keywords = jd.split(' ').filter(w => w.length > 5);
    return keywords.filter(k => !resume.toLowerCase().includes(k.toLowerCase()));
  }
}
