import React, { useState } from 'react';

/**
 * Gamified Onboarding Wizard to guide new users through their first resume creation.
 */
export const OnboardingWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    { id: 1, title: 'Choose a Template', description: 'Pick from our ATS-friendly designs.' },
    { id: 2, title: 'Import LinkedIn', description: 'Save time by pulling your work history.' },
    { id: 3, title: 'Let AI Enhance', description: 'Use our AI to rewrite your bullets with metrics.' },
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 bg-white shadow-xl border border-gray-200 rounded-xl p-5 w-80 z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800">Getting Started</h3>
        <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-gray-600">✕</button>
      </div>

      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.id} className={`flex gap-3 ${currentStep === step.id ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentStep > step.id ? 'bg-green-500 text-white' : currentStep === step.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {currentStep > step.id ? '✓' : step.id}
            </div>
            <div>
              <p className={`text-sm font-semibold ${currentStep === step.id ? 'text-blue-700' : 'text-gray-700'}`}>{step.title}</p>
              {currentStep === step.id && <p className="text-xs text-gray-500 mt-1">{step.description}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-end">
        {currentStep < steps.length ? (
          <button onClick={() => setCurrentStep(curr => curr + 1)} className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Next Step
          </button>
        ) : (
          <button onClick={() => setIsVisible(false)} className="bg-green-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-600 transition">
            Finish
          </button>
        )}
      </div>
    </div>
  );
};
