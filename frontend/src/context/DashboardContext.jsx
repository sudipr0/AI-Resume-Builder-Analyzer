// src/context/DashboardContext.jsx - COMPLETELY FIXED
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import apiService from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const DashboardContext = createContext(null);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [stats, setStats] = useState(null);
  const [recentResumes, setRecentResumes] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [fetchAttempted, setFetchAttempted] = useState(false);

  // ==================== FETCH DASHBOARD DATA ====================
  const fetchDashboardData = useCallback(async (forceRefresh = false) => {
    // Don't fetch if not authenticated
    if (!isAuthenticated) {
      console.log('⏭️ [Dashboard] Not authenticated, skipping fetch');
      setIsLoading(false);
      return;
    }

    // Prevent multiple fetches
    if (isLoading && !forceRefresh) {
      console.log('⏭️ [Dashboard] Already loading, skipping...');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('📊 [Dashboard] Fetching dashboard data...');

      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.log('⚠️ [Dashboard] Fetch timeout - forcing loading to false');
        setIsLoading(false);
        setStats(getFallbackStats());
      }, 8000);

      // Get dashboard stats
      let dashboardStats;
      try {
        dashboardStats = await apiService.dashboard.getDashboardStats();
      } catch (statsError) {
        console.warn('⚠️ [Dashboard] Failed to fetch stats:', statsError);
        dashboardStats = getFallbackStats();
      }

      // Get recent resumes
      let resumes = [];
      try {
        resumes = await apiService.resume.getUserResumes();
        // Sort by updatedAt and take first 5
        const sorted = [...resumes].sort((a, b) =>
          new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setRecentResumes(sorted.slice(0, 5));
      } catch (resumeError) {
        console.warn('⚠️ [Dashboard] Failed to fetch resumes:', resumeError);
        setRecentResumes([]);
      }

      // Generate activity log from resumes
      const activities = generateActivityLog(resumes);
      setActivityLog(activities);

      // Update stats
      setStats(dashboardStats);
      setLastRefreshed(new Date().toISOString());
      setFetchAttempted(true);

      console.log('✅ [Dashboard] Data fetched successfully');
      clearTimeout(timeoutId);

    } catch (error) {
      console.error('❌ [Dashboard] Failed to fetch data:', error);
      setError(error.message || 'Failed to load dashboard data');
      setStats(getFallbackStats());
      setFetchAttempted(true);

      // Only show toast for non-404 errors
      if (error.response?.status !== 404) {
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // ==================== GENERATE ACTIVITY LOG ====================
  const generateActivityLog = (resumes) => {
    const activities = [];

    // Add resume activities
    resumes.forEach(resume => {
      activities.push({
        id: `resume-created-${resume._id}`,
        type: 'resume_created',
        title: 'Resume Created',
        description: `Created "${resume.title}"`,
        timestamp: resume.createdAt,
        resumeId: resume._id,
        icon: '📄'
      });

      activities.push({
        id: `resume-updated-${resume._id}-${resume.updatedAt}`,
        type: 'resume_updated',
        title: 'Resume Updated',
        description: `Updated "${resume.title}"`,
        timestamp: resume.updatedAt,
        resumeId: resume._id,
        icon: '✏️'
      });

      if (resume.analysis?.atsScore) {
        activities.push({
          id: `resume-analyzed-${resume._id}`,
          type: 'resume_analyzed',
          title: 'ATS Analysis',
          description: `Resume scored ${resume.analysis.atsScore}%`,
          timestamp: resume.analysis.lastAnalyzed || resume.updatedAt,
          resumeId: resume._id,
          icon: '🎯',
          score: resume.analysis.atsScore
        });
      }
    });

    // Add login activity
    if (user?.lastLogin) {
      activities.push({
        id: 'user-login',
        type: 'user_login',
        title: 'Logged In',
        description: 'Successful login',
        timestamp: user.lastLogin,
        icon: '🔐'
      });
    }

    // Sort by timestamp (newest first)
    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 20); // Keep last 20 activities
  };

  // ==================== FALLBACK STATS ====================
  const getFallbackStats = () => ({
    totalResumes: 0,
    completedResumes: 0,
    draftResumes: 0,
    inProgressResumes: 0,
    averageAtsScore: 0,
    highScoreResumes: 0,
    mediumScoreResumes: 0,
    lowScoreResumes: 0,
    totalViews: 0,
    totalDownloads: 0,
    completionRate: 0,
    templatesUsed: {},
    recentActivity: [],
    storageUsed: '0 MB',
    storageLimit: '500 MB',
    storageUsedPercentage: 0,
    lastSynced: new Date().toISOString(),
    onlineUsers: 1,
    activeSessions: 0,
    needsImprovementResumes: 0,
    performanceTrend: 'stable'
  });

  // ==================== REFRESH DASHBOARD ====================
  const refreshDashboard = useCallback(async () => {
    await fetchDashboardData(true);
    toast.success('Dashboard refreshed!');
  }, [fetchDashboardData]);

  // ==================== INITIAL FETCH ====================
  useEffect(() => {
    let isMounted = true;
    let timeoutId = null;

    const loadData = async () => {
      if (isAuthenticated && isMounted && !fetchAttempted) {
        await fetchDashboardData();
      } else if (!isAuthenticated && isMounted) {
        setIsLoading(false);
        setStats(getFallbackStats());
        setRecentResumes([]);
        setActivityLog([]);
        setFetchAttempted(true);
      }
    };

    // Safety timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (isMounted && isLoading) {
        console.log('⚠️ [Dashboard] Safety timeout - forcing loading to false');
        setIsLoading(false);
        setStats(getFallbackStats());
        setFetchAttempted(true);
      }
    }, 10000);

    loadData();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isAuthenticated, fetchDashboardData, isLoading, fetchAttempted]);

  // ==================== COMPUTED VALUES ====================
  const atsScoreDistribution = useMemo(() => {
    if (!stats) return { excellent: 0, good: 0, average: 0, poor: 0 };

    return {
      excellent: stats.highScoreResumes || 0,
      good: stats.mediumScoreResumes || 0,
      average: stats.averageScoreResumes || 0,
      poor: stats.lowScoreResumes || 0
    };
  }, [stats]);

  const templateStats = useMemo(() => {
    if (!stats?.templatesUsed) return [];

    return Object.entries(stats.templatesUsed).map(([name, count]) => ({
      name,
      count,
      percentage: stats.totalResumes > 0
        ? Math.round((count / stats.totalResumes) * 100)
        : 0
    }));
  }, [stats]);

  const storagePercentage = useMemo(() => {
    return stats?.storageUsedPercentage || 0;
  }, [stats]);

  // ==================== CONTEXT VALUE ====================
  const value = useMemo(() => ({
    // State
    stats,
    recentResumes,
    activityLog,
    isLoading,
    error,
    lastRefreshed,

    // Computed
    atsScoreDistribution,
    templateStats,
    storagePercentage,

    // Actions
    refreshDashboard,

    // Utilities
    hasData: (stats?.totalResumes || 0) > 0,
    isEmpty: (stats?.totalResumes || 0) === 0
  }), [
    stats, recentResumes, activityLog, isLoading, error, lastRefreshed,
    atsScoreDistribution, templateStats, storagePercentage, refreshDashboard
  ]);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export default React.memo(DashboardContext);