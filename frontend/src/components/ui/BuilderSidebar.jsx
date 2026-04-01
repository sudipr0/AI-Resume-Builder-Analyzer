// src/components/builder/BuilderSidebar.jsx
import React, { useMemo } from 'react';
import {
  Check,
  User,
  GraduationCap,
  Briefcase,
  Code,
  FileText,
  CheckCircle,
  ChevronRight,
  Target,
  Award,
  Sparkles,
  Star,
  Zap,
  Shield
} from 'lucide-react';

const BuilderSidebar = ({
  steps = [],
  currentStep = 0,
  onStepClick = () => { },
  completion = 25,
  resumeData = {},
  showProgress = true,
  showStatus = true,
  className = ''
}) => {
  // Default steps if none provided
  const defaultSteps = [
    { id: 'personal', label: 'Personal Info', icon: User, description: 'Your basic information' },
    { id: 'targetRole', label: 'Target Role', icon: Target, description: 'Job title & industry' },
    { id: 'summary', label: 'Professional Summary', icon: FileText, description: 'Your career highlight' },
    { id: 'experience', label: 'Work Experience', icon: Briefcase, description: 'Your work history' },
    { id: 'education', label: 'Education', icon: GraduationCap, description: 'Academic background' },
    { id: 'skills', label: 'Skills', icon: Code, description: 'Technical & soft skills' },
    { id: 'projects', label: 'Projects', icon: Star, description: 'Personal projects' },
    { id: 'certifications', label: 'Certifications', icon: Award, description: 'Professional certs' },
    { id: 'finalize', label: 'Finalize', icon: Sparkles, description: 'Review & export' }
  ];

  const displaySteps = steps.length ? steps : defaultSteps;

  // Check if a step is completed based on resume data
  const isStepCompleted = (stepId) => {
    if (!resumeData) return false;

    switch (stepId) {
      case 'personal':
      case 'personalInfo':
        return !!(resumeData.personalInfo?.firstName ||
          resumeData.personalInfo?.lastName ||
          resumeData.personalInfo?.email);

      case 'targetRole':
      case 'target':
        return !!(resumeData.targetRole?.title ||
          resumeData.targetRole?.industry ||
          resumeData.jobTitle);

      case 'summary':
        return !!(resumeData.summary?.length > 20);

      case 'experience':
      case 'workExperience':
        return Array.isArray(resumeData.experience) && resumeData.experience.length > 0;

      case 'education':
        return Array.isArray(resumeData.education) && resumeData.education.length > 0;

      case 'skills':
        return (Array.isArray(resumeData.skills) && resumeData.skills.length > 0) ||
          (resumeData.skills?.technical?.length > 0) ||
          (resumeData.skills?.soft?.length > 0);

      case 'projects':
        return Array.isArray(resumeData.projects) && resumeData.projects.length > 0;

      case 'certifications':
        return Array.isArray(resumeData.certifications) && resumeData.certifications.length > 0;

      case 'languages':
        return Array.isArray(resumeData.languages) && resumeData.languages.length > 0;

      case 'finalize':
        // Check if all required sections are completed
        const requiredSteps = ['personal', 'summary', 'experience', 'education', 'skills'];
        return requiredSteps.every(step => {
          if (step === 'personal') return !!(resumeData.personalInfo?.firstName || resumeData.personalInfo?.email);
          if (step === 'summary') return !!(resumeData.summary?.length > 20);
          if (step === 'experience') return Array.isArray(resumeData.experience) && resumeData.experience.length > 0;
          if (step === 'education') return Array.isArray(resumeData.education) && resumeData.education.length > 0;
          if (step === 'skills') return Array.isArray(resumeData.skills) && resumeData.skills.length > 0;
          return false;
        });

      default:
        return false;
    }
  };

  // Calculate step completion for a section
  const getStepCompletion = (stepId) => {
    if (!resumeData) return 0;

    switch (stepId) {
      case 'personal':
      case 'personalInfo':
        let personalScore = 0;
        if (resumeData.personalInfo?.firstName) personalScore += 25;
        if (resumeData.personalInfo?.lastName) personalScore += 25;
        if (resumeData.personalInfo?.email) personalScore += 25;
        if (resumeData.personalInfo?.phone) personalScore += 25;
        return personalScore;

      case 'summary':
        const summaryLength = resumeData.summary?.length || 0;
        if (summaryLength >= 100) return 100;
        if (summaryLength >= 50) return 75;
        if (summaryLength >= 20) return 50;
        if (summaryLength > 0) return 25;
        return 0;

      case 'experience':
        if (!Array.isArray(resumeData.experience)) return 0;
        if (resumeData.experience.length >= 3) return 100;
        if (resumeData.experience.length === 2) return 75;
        if (resumeData.experience.length === 1) return 50;
        return 0;

      case 'skills':
        if (Array.isArray(resumeData.skills)) {
          if (resumeData.skills.length >= 10) return 100;
          if (resumeData.skills.length >= 7) return 75;
          if (resumeData.skills.length >= 4) return 50;
          if (resumeData.skills.length >= 1) return 25;
        }
        return 0;

      default:
        return isStepCompleted(stepId) ? 100 : 0;
    }
  };

  // Get gradient color based on progress
  const getCompletionGradient = (value) => {
    if (value >= 80) return 'from-green-400 to-emerald-600';
    if (value >= 60) return 'from-blue-400 to-indigo-600';
    if (value >= 40) return 'from-amber-400 to-orange-600';
    if (value >= 20) return 'from-orange-400 to-red-600';
    return 'from-red-400 to-rose-600';
  };

  // Get status message based on completion
  const getStatusMessage = useMemo(() => {
    if (completion === 100) return '🎉 Resume Complete! Ready to export';
    if (completion >= 80) return '🌟 Almost there! Final touches needed';
    if (completion >= 60) return '📝 Good progress! Keep going';
    if (completion >= 40) return '⚡ Halfway there!';
    if (completion >= 20) return '🚀 Great start!';
    return '✨ Start building your resume';
  }, [completion]);

  // Get completed steps count
  const completedStepsCount = useMemo(() => {
    return displaySteps.filter(step => isStepCompleted(step.id)).length;
  }, [displaySteps, resumeData]);

  return (
    <div className={`w-64 h-full bg-gradient-to-b from-[#0a1929] to-[#0f2744] text-white flex flex-col shadow-2xl ${className}`}>
      {/* Header */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Resume Builder</h2>
            <p className="text-xs text-blue-200/70">Create your perfect resume</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-white">{completedStepsCount}</p>
            <p className="text-[10px] text-blue-200/60">Steps Done</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-white">{displaySteps.length}</p>
            <p className="text-[10px] text-blue-200/60">Total Steps</p>
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="px-3 py-4 space-y-1">
          {displaySteps.map((step, index) => {
            const active = index === currentStep;
            const completed = isStepCompleted(step.id);
            const stepProgress = getStepCompletion(step.id);
            const StepIcon = step.icon || FileText;
            const isRequired = ['personal', 'summary', 'experience', 'skills'].includes(step.id);

            return (
              <button
                key={step.id}
                onClick={() => onStepClick(index)}
                className={`
                  w-full flex items-start gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                  ${active
                    ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                    : 'hover:bg-white/5'
                  }
                  ${completed ? 'opacity-90' : 'opacity-100'}
                `}
              >
                {/* Status Icon */}
                <div className="relative flex-shrink-0">
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300
                    ${completed
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/20'
                      : active
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20'
                        : 'bg-white/10 border border-white/20 group-hover:bg-white/20'
                    }
                  `}>
                    {completed ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : active ? (
                      <StepIcon className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-xs font-medium text-white/70">{index + 1}</span>
                    )}
                  </div>

                  {/* Small progress indicator for incomplete steps */}
                  {!completed && stepProgress > 0 && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 border-2 border-[#0a1929]" />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <p className={`
                      text-sm font-medium truncate
                      ${active ? 'text-white' : completed ? 'text-white/80' : 'text-white/70'}
                    `}>
                      {step.label}
                    </p>

                    {/* Required badge */}
                    {isRequired && !completed && (
                      <span className="px-1.5 py-0.5 bg-red-500/20 text-red-300 text-[10px] rounded-full border border-red-500/30">
                        Required
                      </span>
                    )}

                    {/* Completed badge */}
                    {completed && (
                      <span className="px-1.5 py-0.5 bg-green-500/20 text-green-300 text-[10px] rounded-full border border-green-500/30 flex items-center gap-0.5">
                        <CheckCircle className="w-2.5 h-2.5" /> Done
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {step.description && (
                    <p className="text-[10px] text-white/40 mt-0.5 truncate">
                      {step.description}
                    </p>
                  )}

                  {/* Progress bar for active step */}
                  {active && stepProgress > 0 && stepProgress < 100 && (
                    <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-300"
                        style={{ width: `${stepProgress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Right arrow for non-active steps */}
                {!active && !completed && (
                  <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/50 transition-colors flex-shrink-0" />
                )}

                {/* Check for completed steps */}
                {completed && !active && (
                  <CheckCircle className="w-4 h-4 text-green-400/70 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer - Progress Section */}
      {showProgress && (
        <div className="border-t border-white/10 px-5 py-5 space-y-3 bg-gradient-to-t from-black/20 to-transparent">
          {/* Overall Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white/5 rounded-lg flex items-center justify-center">
                  <Zap className="w-3 h-3 text-yellow-400" />
                </div>
                <p className="text-xs font-medium text-white/70 uppercase tracking-wider">Progress</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-white">{completion}%</span>
                <span className="text-[10px] text-white/40">complete</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full bg-gradient-to-r ${getCompletionGradient(completion)} rounded-full transition-all duration-700 ease-out shadow-lg`}
                style={{ width: `${completion}%` }}
              />
            </div>

            {/* Step indicators */}
            <div className="flex justify-between mt-1 px-1">
              {[0, 25, 50, 75, 100].map((mark) => (
                <div
                  key={mark}
                  className={`w-1 h-1 rounded-full transition-colors duration-300 ${completion >= mark ? 'bg-blue-400' : 'bg-white/20'
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Status Message */}
          {showStatus && (
            <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2.5">
              {completion === 100 ? (
                <Shield className="w-4 h-4 text-green-400 flex-shrink-0" />
              ) : completion >= 80 ? (
                <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              ) : (
                <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0" />
              )}
              <p className="text-xs text-white/80 flex-1">
                {getStatusMessage}
              </p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-xs font-medium text-white/60">Completed</p>
              <p className="text-lg font-bold text-white">{completedStepsCount}/{displaySteps.length}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-xs font-medium text-white/60">Remaining</p>
              <p className="text-lg font-bold text-white">{displaySteps.length - completedStepsCount}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(BuilderSidebar);