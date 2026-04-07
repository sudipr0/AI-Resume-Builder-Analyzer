import React from 'react';
import {
  Mail, Phone, MapPin, Globe, Linkedin, Github,
  Briefcase, GraduationCap, Award,
  Code, Star, CheckCircle
} from 'lucide-react';

const ResumePreview = ({ resumeData, template = 'modern' }) => {
  if (!resumeData) {
    return (
      <div className="flex items-center justify-center h-full text-black italic">
        No resume data available
      </div>
    );
  }

  const templates = {
    modern: { primary: '#3b82f6', text: '#111827', font: 'inter' },
    classic: { primary: '#1f2937', text: '#111827', font: 'serif' },
    creative: { primary: '#8b5cf6', text: '#1f2937', font: 'sans' },
    minimal: { primary: '#000000', text: '#111827', font: 'mono' }
  };

  const currentTemplate = templates[template] || templates.modern;
  const {
    personalInfo = {},
    summary = '',
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = []
  } = resumeData;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch (e) { return dateString; }
  };

  return (
    <div className="resume-preview-container bg-white h-full overflow-y-auto text-black" style={{ fontFamily: currentTemplate.font }}>
      <div className="p-6">
        <header className="mb-6 border-b pb-6" style={{ borderColor: `${currentTemplate.primary}20` }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-black">
            {personalInfo.name || personalInfo.fullName || `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim() || 'Your Name'}
          </h1>
          <div className="text-lg font-semibold mb-4 text-black">
            {personalInfo.jobTitle || 'Professional Title'}
          </div>
          {summary && <p className="text-black text-sm">{summary}</p>}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {experience.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4 border-b pb-2 uppercase text-black">Experience</h2>
                {experience.map((exp, idx) => (
                  <div key={idx} className="mb-4">
                    <h3 className="font-bold text-black">{exp.jobTitle || exp.position}</h3>
                    <div className="text-sm text-black">{exp.company}</div>
                    <p className="text-sm text-black">{exp.description}</p>
                  </div>
                ))}
              </section>
            )}
          </div>

          <div className="space-y-6">
            {skills.length > 0 && (
              <section>
                <h2 className="text-lg font-bold mb-4 border-b pb-2 uppercase text-black">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 rounded border" style={{ backgroundColor: `${currentTemplate.primary}05`, color: '#000' }}>
                      {typeof skill === 'object' ? skill.name : skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ResumePreview);
