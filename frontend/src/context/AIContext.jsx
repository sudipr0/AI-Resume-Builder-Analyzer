// src/context/AIContext.jsx
import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import apiService from '../services/api';

const AIContext = createContext(null);

export const useAI = () => {
    const context = useContext(AIContext);
    if (!context) {
        throw new Error('useAI must be used within an AIProvider');
    }
    return context;
};

export const AIProvider = ({ children }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [error, setError] = useState(null);

    const [atsScore, setAtsScore] = useState(null);
    const [keywordMatch, setKeywordMatch] = useState(null);
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [summaryVariants, setSummaryVariants] = useState([]);
    const [skillRecommendations, setSkillRecommendations] = useState([]);

    const [globalJobDescription, setGlobalJobDescription] = useState('');
    const [globalKeywords, setGlobalKeywords] = useState([]);
    const [targetRole, setTargetRole] = useState('');

    const [aiStatus, setAiStatus] = useState({
        connected: false,
        processing: false,
        model: 'AI Engine',
        error: null
    });

    const api = apiService;

    const checkAIStatus = useCallback(async () => {
        try {
            const response = await api.get('/ai/health');
            if (response.success) {
                setAiStatus({
                    connected: true,
                    processing: false,
                    model: response.aiService?.providers?.[0]?.model || 'AI Engine',
                    error: null
                });
                return true;
            }
            return false;
        } catch (error) {
            setAiStatus(prev => ({ ...prev, connected: false, error: error.message }));
            return false;
        }
    }, [api]);

    const extractKeywords = useCallback(async (text) => {
        if (!text || text.length < 20) return null;
        setIsAnalyzing(true);
        try {
            const response = await api.post('/ai/extract-keywords', { text });
            if (response.success) {
                const { keywords, suggestedRole } = response.data;
                setGlobalKeywords(keywords || []);
                setGlobalJobDescription(text);
                if (suggestedRole) setTargetRole(suggestedRole);
                return response.data;
            }
            throw new Error(response.error || 'Failed to extract keywords');
        } catch (error) {
            console.error('Extraction error:', error);
            return null;
        } finally {
            setIsAnalyzing(false);
        }
    }, [api]);

    const generateSummaryVariants = useCallback(async (resumeData, jobDescription = '', options = {}) => {
        setIsGenerating(true);
        try {
            const response = await api.post('/ai/generate/summary', {
                resumeData,
                jobDescription,
                options
            });
            if (response.success) {
                setSummaryVariants(response.data.variants || []);
                return response.data;
            }
            throw new Error(response.error || 'Failed to generate summary');
        } catch (error) {
            console.error('Generation error:', error);
            return null;
        } finally {
            setIsGenerating(false);
        }
    }, [api]);

    const analyzeResume = useCallback(async (resumeData, jobDescription = '') => {
        setIsAnalyzing(true);
        try {
            const response = await api.post('/ai/analyze-resume', {
                resumeData,
                jobDescription
            });
            if (response.success) {
                const result = response.data;
                setAtsScore(result.atsScore);
                setKeywordMatch(result.keywordMatch);
                setAiSuggestions(result.suggestions || []);
                return result;
            }
            throw new Error(response.error || 'Failed to analyze resume');
        } catch (error) {
            console.error('Analysis error:', error);
            return null;
        } finally {
            setIsAnalyzing(false);
        }
    }, [api]);

    const optimizeSummary = useCallback(async (summary, jobDescription = '', options = {}) => {
        setIsOptimizing(true);
        try {
            const response = await api.post('/ai/enhance-section', {
                section: 'summary',
                content: summary,
                targetRole: jobDescription || targetRole
            });
            if (response.success) {
                return response.data;
            }
            throw new Error(response.error || 'Failed to optimize summary');
        } catch (error) {
            console.error('Optimization error:', error);
            return null;
        } finally {
            setIsOptimizing(false);
        }
    }, [api, targetRole]);

    useEffect(() => {
        checkAIStatus();
    }, [checkAIStatus]);

    const value = useMemo(() => ({
        isAnalyzing, isGenerating, isOptimizing, error,
        atsScore, keywordMatch, aiSuggestions, summaryVariants,
        skillRecommendations, globalJobDescription, globalKeywords,
        targetRole, aiStatus,
        checkAIStatus, extractKeywords, generateSummaryVariants,
        optimizeSummary, analyzeResume
    }), [
        isAnalyzing, isGenerating, isOptimizing, error,
        atsScore, keywordMatch, aiSuggestions, summaryVariants,
        skillRecommendations, globalJobDescription, globalKeywords,
        targetRole, aiStatus,
        checkAIStatus, extractKeywords, generateSummaryVariants,
        optimizeSummary, analyzeResume
    ]);

    return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};
