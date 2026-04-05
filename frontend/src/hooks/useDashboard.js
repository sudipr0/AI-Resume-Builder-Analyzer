// src/hooks/useDashboard.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '../services/api';
import { toast } from 'react-hot-toast';

export const useDashboardStats = (userId) => {
    return useQuery({
        queryKey: ['dashboardStats', userId],
        queryFn: async () => {
            if (!userId) throw new Error('User ID required');
            const resumes = await apiService.resume.getUserResumes();
            return calculateStatsFromResumes(resumes);
        },
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
    });
};

export const useUserResumes = (userId) => {
    return useQuery({
        queryKey: ['userResumes', userId],
        queryFn: async () => {
            if (!userId) return [];
            return await apiService.resume.getUserResumes();
        },
        enabled: !!userId,
    });
};

const calculateStatsFromResumes = (resumes) => {
    if (!Array.isArray(resumes) || resumes.length === 0) {
        return {
            totalResumes: 0,
            completedResumes: 0,
            draftResumes: 0,
            averageAtsScore: 0,
            totalViews: 0,
            totalDownloads: 0,
            completionRate: 0,
            storageUsedPercentage: 0,
            recentActivity: []
        };
    }

    const totalResumes = resumes.length;
    const completedResumes = resumes.filter(r => r.status === 'completed').length;
    const draftResumes = resumes.filter(r => r.status === 'draft').length;
    
    const atsScores = resumes
        .filter(r => r.analysis?.atsScore)
        .map(r => r.analysis.atsScore);
    
    const averageAtsScore = atsScores.length > 0 
        ? Math.round(atsScores.reduce((a, b) => a + b, 0) / atsScores.length) 
        : 0;

    const totalViews = resumes.reduce((sum, r) => sum + (r.views || 0), 0);
    const totalDownloads = resumes.reduce((sum, r) => sum + (r.downloads || 0), 0);
    const completionRate = Math.round((completedResumes / totalResumes) * 100);

    const recentActivity = resumes
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5)
        .map(r => ({
            id: r._id,
            title: r.title,
            updatedAt: r.updatedAt,
            status: r.status
        }));

    return {
        totalResumes,
        completedResumes,
        draftResumes,
        averageAtsScore,
        totalViews,
        totalDownloads,
        completionRate,
        storageUsedPercentage: Math.min(Math.round((totalResumes / 50) * 100), 100), // Mock limit of 50
        recentActivity
    };
};
