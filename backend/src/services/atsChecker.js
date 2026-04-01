/**
 * ATS Compatibility Checker
 * Evaluates resumes for parsing suitability based on common ATS rules.
 */
class ATSChecker {
  
  checkCompatibility(resumeData, format, rawText) {
    const issues = [];
    const warnings = [];
    const recommendations = [];
    
    // Check 1: File format
    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'].includes(format)) {
      issues.push({
        type: 'format',
        severity: 'high',
        message: 'Unsupported format. Use PDF or DOCX for best ATS compatibility'
      });
    }
    
    // Check 2: Contact information
    if (!resumeData?.personalInfo?.email || !resumeData?.personalInfo?.phone) {
      issues.push({
        type: 'contact',
        severity: 'high',
        message: 'Missing contact information (Email or Phone number is empty)'
      });
    }
    
    // Check 3: Section headers
    const standardHeaders = [
      'experience', 'education', 'skills', 'projects', 'certifications', 'summary',
      'work experience', 'professional experience'
    ];
    const userHeaders = this.extractSectionHeaders(resumeData);
    const nonStandardHeaders = userHeaders.filter(
      h => h !== '' && !standardHeaders.includes(h.toLowerCase())
    );
    
    if (nonStandardHeaders.length > 0) {
      warnings.push({
        type: 'headers',
        severity: 'medium',
        message: `Non-standard section headers detected: ${nonStandardHeaders.join(', ')}`,
        suggestion: 'Use standard headers like "Experience" and "Education" for better parsing.'
      });
    }
    
    // Check 4: Date formats
    const inconsistentDates = this.checkDateConsistency(resumeData);
    if (inconsistentDates) {
      warnings.push({
        type: 'dates',
        severity: 'low',
        message: 'Inconsistent or invalid date formats detected',
        suggestion: 'Use a consistent format like MM/YYYY.'
      });
    }
    
    // Check 5: Keywords
    const keywordDensity = this.calculateKeywordDensity(rawText);
    if (keywordDensity < 0.02) {
      recommendations.push({
        type: 'keywords',
        message: 'Low keyword density detected.',
        suggestion: 'Add more relevant industry terms to your skills and experience descriptions.'
      });
    }
    
    // Check 6: Complex formatting (Heuristic for raw text analysis)
    if (this.hasComplexFormatting(rawText)) {
      warnings.push({
        type: 'formatting',
        severity: 'medium',
        message: 'Potentially complex layout detected (e.g. multiple columns or wide spaces)',
        suggestion: 'Simplify layout to a single column if you experience ATS parsing drops.'
      });
    }
    
    // Calculate overall score
    const score = this.calculateOverallScore(issues, warnings, recommendations);
    
    return {
      score,
      issues,
      warnings,
      recommendations,
      verdict: this.getVerdict(score)
    };
  }
  
  extractSectionHeaders(resumeData) {
    const headers = [];
    if (resumeData?.experience?.length > 0) headers.push('Experience');
    if (resumeData?.education?.length > 0) headers.push('Education');
    if (resumeData?.skills?.length > 0) headers.push('Skills');
    if (resumeData?.summary?.length > 0) headers.push('Summary');
    
    resumeData?.customSections?.forEach(sec => {
      headers.push(sec.title);
    });
    return headers;
  }
  
  checkDateConsistency(resumeData) {
    let hasDates = false;
    let inconsistent = false;
    // Simple heuristic: Ensure dates exist and look like typical date ranges (e.g., 2020, 05/2021)
    return inconsistent; // Mocked logic
  }
  
  calculateKeywordDensity(rawText) {
    if (!rawText) return 0;
    const words = rawText.split(/\\s+/).length;
    // Mock algorithm: Assume 3% of words are keywords for the baseline
    return words > 0 ? 0.03 : 0; 
  }
  
  hasComplexFormatting(rawText) {
    if (!rawText) return false;
    // Simple check: too many massive spaces might indicate multi-column text that didn't parse cleanly
    return / {10,}/.test(rawText);
  }
  
  calculateOverallScore(issues, warnings, recommendations) {
    let score = 100;
    
    issues.forEach(issue => {
      if (issue.severity === 'high') score -= 15;
      else score -= 10;
    });
    
    warnings.forEach(warning => {
      if (warning.severity === 'medium') score -= 5;
      else score -= 3;
    });

    recommendations.forEach(() => {
      score -= 2; // minor ding
    });
    
    return Math.max(0, Math.min(100, score));
  }
  
  getVerdict(score) {
    if (score >= 90) return 'Excellent - Highly ATS-compatible';
    if (score >= 75) return 'Good - Should pass most ATS systems';
    if (score >= 60) return 'Fair - May have issues with some ATS';
    return 'Poor - Likely to have ATS parsing problems';
  }
}

export default new ATSChecker();
