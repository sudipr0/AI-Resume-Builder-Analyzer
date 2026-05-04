/**
 * Optimized prompt templates to reduce token count and improve AI generation quality.
 */

export const roleBasedTailoringPrompt = (role, currentResume, jobDescription) => `
You are an expert ATS optimization engine. Your goal is to tailor the provided resume for a ${role} position.
Instructions:
1. Align the professional summary with the target role.
2. Rewrite bullet points to emphasize skills relevant to the job description.
3. Ensure high keyword density for ATS without keyword stuffing.
4. Keep the exact same JSON schema structure as the input.

Job Description:
${jobDescription || 'None provided. Optimize generally for the role.'}

Current Resume JSON:
${JSON.stringify(currentResume)}
`;

export const metricGeneratorPrompt = (bulletPoint) => `
Rewrite the following resume bullet point to be more impactful by adding placeholder metrics [like this]. 
Use the STAR method (Situation, Task, Action, Result). 
Start with a strong action verb.

Original: ${bulletPoint}
Improved:
`;

export const sectionScorePrompt = (sectionName, sectionContent) => `
Grade the following ${sectionName} section of a resume from 0 to 100 based on modern HR best practices.
Provide exactly 3 actionable feedback bullet points to improve it.

Section Content:
${sectionContent}

Respond in JSON format: { "score": number, "feedback": string[] }
`;
