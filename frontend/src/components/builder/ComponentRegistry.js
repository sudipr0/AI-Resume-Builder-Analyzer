// src/components/builder/ComponentRegistry.js
import PersonalInfoPage from '../section/PersonalInfoPage';
import SummaryPage from '../section/SummaryPage';
import ExperiencePage from '../section/ExperiencePage';
import SkillsPage from '../section/SkillsPage';
import EducationPage from '../section/EducationPage';
import ProjectsPage from '../section/ProjectsPage';
import CertificationsPage from '../section/CertificationsPage';
import LanguagesPage from '../section/LanguagesPage';

/**
 * Registry of all components available to the visual builder.
 * This allows the system to render components dynamically based on a JSON schema.
 */
export const COMPONENT_REGISTRY = {
  personal: PersonalInfoPage,
  summary: SummaryPage,
  experience: ExperiencePage,
  skills: SkillsPage,
  education: EducationPage,
  projects: ProjectsPage,
  certifications: CertificationsPage,
  languages: LanguagesPage,
};

/**
 * Default schema for a new resume.
 * This can be loaded from the backend or a local config file.
 */
export const DEFAULT_RESUME_SCHEMA = {
  version: '1.0',
  sections: [
    { id: 'sec_1', type: 'personal', modelKey: 'personalInfo', label: 'Personal Information' },
    { id: 'sec_2', type: 'summary', modelKey: 'summary', label: 'Professional Summary' },
    { id: 'sec_3', type: 'experience', modelKey: 'experience', label: 'Work Experience' },
    { id: 'sec_4', type: 'skills', modelKey: 'skills', label: 'Skills & Competencies' },
    { id: 'sec_5', type: 'education', modelKey: 'education', label: 'Education' },
    { id: 'sec_6', type: 'projects', modelKey: 'projects', label: 'Projects' },
    { id: 'sec_7', type: 'certifications', modelKey: 'certifications', label: 'Certifications' },
    { id: 'sec_8', type: 'languages', modelKey: 'languages', label: 'Languages' },
  ]
};
