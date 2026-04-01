// src/hooks/useSectionNavigation.jsx
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

/**
 * Hook for managing section navigation in the builder
 * Simplified version that works with your Builder.jsx
 * @param {Object} options - Configuration options
 * @returns {Object} Navigation utilities and state
 */
export const useSectionNavigation = ({
  currentStep,
  totalSteps,
  onNavigate,
  validateBeforeNavigate = true,
  autoSave = true
} = {}) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState([]);
  const navigationInProgress = useRef(false);

  // Update history when step changes
  useEffect(() => {
    if (currentStep !== undefined && !navigationInProgress.current) {
      setNavigationHistory(prev => {
        if (prev.length === 0 || prev[prev.length - 1] !== currentStep) {
          return [...prev, currentStep];
        }
        return prev;
      });
    }
  }, [currentStep]);

  // Navigation function
  const navigateToStep = useCallback(async (newStep) => {
    // Prevent multiple simultaneous navigations
    if (isNavigating || navigationInProgress.current) {
      console.log('⏳ Navigation already in progress, skipping');
      return false;
    }

    // Don't navigate if already on that step
    if (newStep === currentStep) {
      return true;
    }

    // Validate step range
    if (newStep < 0 || newStep >= totalSteps) {
      console.warn('Invalid step index:', newStep);
      return false;
    }

    setIsNavigating(true);
    navigationInProgress.current = true;

    try {
      console.log(`🔄 Navigating from step ${currentStep} to ${newStep}`);

      // Call the navigation handler
      if (onNavigate) {
        const result = await onNavigate(newStep);
        if (result === false) {
          console.log('⛔ Navigation cancelled by handler');
          return false;
        }
      }

      // Add to history
      setNavigationHistory(prev => [...prev, newStep]);

      return true;
    } catch (error) {
      console.error('Navigation error:', error);
      return false;
    } finally {
      setIsNavigating(false);
      navigationInProgress.current = false;
    }
  }, [currentStep, totalSteps, onNavigate, isNavigating]);

  // Go to next step
  const goToNextStep = useCallback(async () => {
    if (currentStep < totalSteps - 1) {
      return await navigateToStep(currentStep + 1);
    }
    return false;
  }, [currentStep, totalSteps, navigateToStep]);

  // Go to previous step
  const goToPrevStep = useCallback(async () => {
    if (currentStep > 0) {
      return await navigateToStep(currentStep - 1);
    }
    return false;
  }, [currentStep, navigateToStep]);

  // Go to specific step
  const goToStep = useCallback(async (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      return await navigateToStep(stepIndex);
    }
    return false;
  }, [totalSteps, navigateToStep]);

  // Go back in history
  const goBackInHistory = useCallback(async () => {
    if (navigationHistory.length <= 1) {
      return false;
    }
    const previousStep = navigationHistory[navigationHistory.length - 2];
    return await goToStep(previousStep);
  }, [navigationHistory, goToStep]);

  // Check if can go to next
  const canGoNext = useMemo(() => {
    return currentStep < totalSteps - 1 && !isNavigating;
  }, [currentStep, totalSteps, isNavigating]);

  // Check if can go to previous
  const canGoPrev = useMemo(() => {
    return currentStep > 0 && !isNavigating;
  }, [currentStep, isNavigating]);

  // Check if first step
  const isFirstStep = useMemo(() => {
    return currentStep === 0;
  }, [currentStep]);

  // Check if last step
  const isLastStep = useMemo(() => {
    return currentStep === totalSteps - 1;
  }, [currentStep, totalSteps]);

  // Get progress percentage
  const progressPercentage = useMemo(() => {
    if (totalSteps === 0) return 0;
    return Math.round(((currentStep + 1) / totalSteps) * 100);
  }, [currentStep, totalSteps]);

  // Get step status
  const getStepStatus = useCallback((stepIndex) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  }, [currentStep]);

  // Check if a step is accessible
  const isStepAccessible = useCallback((stepIndex) => {
    if (!validateBeforeNavigate) return true;
    // Can only navigate to steps that are not too far ahead
    // This is a simple implementation - you can make it more sophisticated
    return stepIndex <= currentStep + 1;
  }, [currentStep, validateBeforeNavigate]);

  // Reset navigation
  const resetNavigation = useCallback(() => {
    setNavigationHistory([]);
    setIsNavigating(false);
    navigationInProgress.current = false;
  }, []);

  return {
    // State
    currentStep,
    isNavigating,
    navigationHistory,

    // Navigation functions
    goToNextStep,
    goToPrevStep,
    goToStep,
    goBackInHistory,
    navigateToStep,

    // Status flags
    canGoNext,
    canGoPrev,
    isFirstStep,
    isLastStep,

    // Progress
    progressPercentage,
    totalSteps,

    // Utilities
    getStepStatus,
    isStepAccessible,
    resetNavigation,

    // Convenience (for backward compatibility)
    canGoBack: canGoPrev,
    canGoForward: canGoNext,
    isFirst: isFirstStep,
    isLast: isLastStep,
    progress: progressPercentage
  };
};

// For backward compatibility, also export as default
export default useSectionNavigation;