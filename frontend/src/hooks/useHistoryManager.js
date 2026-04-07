// src/hooks/useHistoryManager.js
import { useState, useEffect, useCallback } from 'react';
import historyService from '../services/historyService';

/**
 * Custom hook for managing resume and analyzer history
 * Handles fetching, caching, and updating history data
 */
export const useHistoryManager = () => {
    const [resumeHistory, setResumeHistory] = useState([]);
    const [analyzerHistory, setAnalyzerHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Load resume history
     */
    const loadResumeHistory = useCallback(async (force = false) => {
        try {
            setLoading(true);
            setError(null);
            const history = await historyService.getResumeHistory();
            setResumeHistory(history);
        } catch (err) {
            console.error('Error loading resume history:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Load analyzer history
     */
    const loadAnalyzerHistory = useCallback(async (force = false) => {
        try {
            setLoading(true);
            setError(null);
            const history = await historyService.getAnalyzerHistory();
            setAnalyzerHistory(history);
        } catch (err) {
            console.error('Error loading analyzer history:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Load both histories
     */
    const loadAllHistory = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const [resumes, analyses] = await Promise.all([
                historyService.getResumeHistory(),
                historyService.getAnalyzerHistory(),
            ]);
            setResumeHistory(resumes);
            setAnalyzerHistory(analyses);
        } catch (err) {
            console.error('Error loading history:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Add resume to history
     */
    const addResume = useCallback((resume) => {
        const updated = historyService.addToResumeHistory(resume);
        setResumeHistory(updated);
    }, []);

    /**
     * Add analysis to history
     */
    const addAnalysis = useCallback((analysis) => {
        const updated = historyService.addToAnalyzerHistory(analysis);
        setAnalyzerHistory(updated);
    }, []);

    /**
     * Remove resume from history
     */
    const removeResume = useCallback((resumeId) => {
        const updated = resumeHistory.filter(r => r.id !== resumeId);
        historyService.saveResumeHistory(updated);
        setResumeHistory(updated);
    }, [resumeHistory]);

    /**
     * Remove analysis from history
     */
    const removeAnalysis = useCallback((analysisId) => {
        const updated = analyzerHistory.filter(a => a.id !== analysisId);
        historyService.saveAnalyzerHistory(updated);
        setAnalyzerHistory(updated);
    }, [analyzerHistory]);

    /**
     * Clear all resume history
     */
    const clearResumeHistory = useCallback(() => {
        historyService.clearResumeHistory();
        setResumeHistory([]);
    }, []);

    /**
     * Clear all analyzer history
     */
    const clearAnalyzerHistory = useCallback(() => {
        historyService.clearAnalyzerHistory();
        setAnalyzerHistory([]);
    }, []);

    /**
     * Get recent resumes (first N items)
     */
    const getRecentResumes = useCallback((count = 5) => {
        return resumeHistory.slice(0, count);
    }, [resumeHistory]);

    /**
     * Get recent analyses (first N items)
     */
    const getRecentAnalyses = useCallback((count = 5) => {
        return analyzerHistory.slice(0, count);
    }, [analyzerHistory]);

    // Load history on mount
    useEffect(() => {
        loadAllHistory();
    }, [loadAllHistory]);

    return {
        // Data
        resumeHistory,
        analyzerHistory,
        loading,
        error,

        // Resume History Methods
        loadResumeHistory,
        addResume,
        removeResume,
        clearResumeHistory,
        getRecentResumes,

        // Analyzer History Methods
        loadAnalyzerHistory,
        addAnalysis,
        removeAnalysis,
        clearAnalyzerHistory,
        getRecentAnalyses,

        // General Methods
        loadAllHistory,
    };
};

export default useHistoryManager;
