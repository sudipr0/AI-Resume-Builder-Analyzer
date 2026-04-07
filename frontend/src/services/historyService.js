// src/services/historyService.js
import apiService from './api';

const STORAGE_KEYS = {
    RESUME_HISTORY: 'resume_history',
    ANALYZER_HISTORY: 'analyzer_history',
    LAST_OPENED_RESUME: 'last_opened_resume',
    LAST_OPENED_ANALYZER: 'last_opened_analyzer',
};

class HistoryService {
    /**
     * Fetch resume history from backend or localStorage
     */
    async getResumeHistory() {
        try {
            // Try to fetch from backend first
            const response = await apiService.resume.getResumes();
            if (response && Array.isArray(response)) {
                const history = response.map(resume => ({
                    id: resume._id,
                    title: resume.title || 'Untitled Resume',
                    lastEdited: resume.updatedAt || new Date().toISOString(),
                    createdAt: resume.createdAt,
                    status: resume.status,
                    atsScore: resume.analysis?.atsScore,
                }));

                // Update localStorage as cache
                this.saveResumeHistory(history);
                return history;
            }
        } catch (error) {
            console.warn('Failed to fetch resume history from backend:', error);
        }

        // Fallback to localStorage
        return this.getResumeHistoryLocal();
    }

    /**
     * Get resume history from localStorage
     */
    getResumeHistoryLocal() {
        try {
            const cached = localStorage.getItem(STORAGE_KEYS.RESUME_HISTORY);
            return cached ? JSON.parse(cached) : [];
        } catch (error) {
            console.error('Error reading resume history from localStorage:', error);
            return [];
        }
    }

    /**
     * Save resume history to localStorage
     */
    saveResumeHistory(history) {
        try {
            localStorage.setItem(STORAGE_KEYS.RESUME_HISTORY, JSON.stringify(history));
        } catch (error) {
            console.error('Error saving resume history:', error);
        }
    }

    /**
     * Add resume to history (when created/uploaded)
     */
    addToResumeHistory(resume) {
        try {
            const history = this.getResumeHistoryLocal();
            const newEntry = {
                id: resume._id || resume.id,
                title: resume.title || 'Untitled Resume',
                lastEdited: new Date().toISOString(),
                createdAt: resume.createdAt || new Date().toISOString(),
                status: resume.status,
                atsScore: resume.analysis?.atsScore,
            };

            // Remove if exists and add to top
            const filtered = history.filter(r => r.id !== newEntry.id);
            const updated = [newEntry, ...filtered].slice(0, 50); // Keep last 50

            this.saveResumeHistory(updated);
            return updated;
        } catch (error) {
            console.error('Error adding to resume history:', error);
            return [];
        }
    }

    /**
     * Fetch analyzer history
     */
    async getAnalyzerHistory() {
        try {
            // Try to fetch from backend first
            const response = await apiService.analyzer?.getHistory?.();
            if (response && Array.isArray(response)) {
                const history = response.map(item => ({
                    id: item._id,
                    resumeTitle: item.resumeTitle,
                    atsScore: item.atsScore,
                    keywords: item.keywords,
                    suggestions: item.suggestions,
                    analyzedAt: item.createdAt || new Date().toISOString(),
                }));

                this.saveAnalyzerHistory(history);
                return history;
            }
        } catch (error) {
            console.warn('Failed to fetch analyzer history from backend:', error);
        }

        // Fallback to localStorage
        return this.getAnalyzerHistoryLocal();
    }

    /**
     * Get analyzer history from localStorage
     */
    getAnalyzerHistoryLocal() {
        try {
            const cached = localStorage.getItem(STORAGE_KEYS.ANALYZER_HISTORY);
            return cached ? JSON.parse(cached) : [];
        } catch (error) {
            console.error('Error reading analyzer history from localStorage:', error);
            return [];
        }
    }

    /**
     * Save analyzer history to localStorage
     */
    saveAnalyzerHistory(history) {
        try {
            localStorage.setItem(STORAGE_KEYS.ANALYZER_HISTORY, JSON.stringify(history));
        } catch (error) {
            console.error('Error saving analyzer history:', error);
        }
    }

    /**
     * Add analysis to history
     */
    addToAnalyzerHistory(analysis) {
        try {
            const history = this.getAnalyzerHistoryLocal();
            const newEntry = {
                id: analysis._id || Math.random().toString(36).substr(2, 9),
                resumeTitle: analysis.resumeTitle || 'Analysis',
                atsScore: analysis.atsScore,
                keywords: analysis.keywords,
                suggestions: analysis.suggestions,
                analyzedAt: new Date().toISOString(),
            };

            const filtered = history.filter(a => a.id !== newEntry.id);
            const updated = [newEntry, ...filtered].slice(0, 50); // Keep last 50

            this.saveAnalyzerHistory(updated);
            return updated;
        } catch (error) {
            console.error('Error adding to analyzer history:', error);
            return [];
        }
    }

    /**
     * Get last opened resume
     */
    getLastOpenedResume() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.LAST_OPENED_RESUME);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading last opened resume:', error);
            return null;
        }
    }

    /**
     * Save last opened resume
     */
    saveLastOpenedResume(resume) {
        try {
            localStorage.setItem(STORAGE_KEYS.LAST_OPENED_RESUME, JSON.stringify({
                id: resume._id || resume.id,
                title: resume.title,
                timestamp: new Date().toISOString(),
            }));
        } catch (error) {
            console.error('Error saving last opened resume:', error);
        }
    }

    /**
     * Clear all history
     */
    clearAllHistory() {
        try {
            localStorage.removeItem(STORAGE_KEYS.RESUME_HISTORY);
            localStorage.removeItem(STORAGE_KEYS.ANALYZER_HISTORY);
            localStorage.removeItem(STORAGE_KEYS.LAST_OPENED_RESUME);
            localStorage.removeItem(STORAGE_KEYS.LAST_OPENED_ANALYZER);
        } catch (error) {
            console.error('Error clearing history:', error);
        }
    }

    /**
     * Clear resume history only
     */
    clearResumeHistory() {
        try {
            localStorage.removeItem(STORAGE_KEYS.RESUME_HISTORY);
        } catch (error) {
            console.error('Error clearing resume history:', error);
        }
    }

    /**
     * Clear analyzer history only
     */
    clearAnalyzerHistory() {
        try {
            localStorage.removeItem(STORAGE_KEYS.ANALYZER_HISTORY);
        } catch (error) {
            console.error('Error clearing analyzer history:', error);
        }
    }
}

export default new HistoryService();
