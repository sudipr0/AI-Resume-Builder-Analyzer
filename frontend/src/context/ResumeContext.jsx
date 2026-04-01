// src/context/ResumeContext.jsx - FIXED VERSION
import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import apiService from '../services/api';

const ResumeContext = createContext();

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within ResumeProvider');
  }
  return context;
};

export const ResumeProvider = ({ children }) => {
  const [resumes, setResumes] = useState([]);
  const [currentResume, setCurrentResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [offlineMode, setOfflineMode] = useState(!navigator.onLine);

  const mountedRef = useRef(true);
  const saveTimeoutRef = useRef(null);
  const syncAttemptsRef = useRef({});

  console.log('🔥 ResumeContext initialized', { online: navigator.onLine });

  // ==================== ONLINE/OFFLINE DETECTION ====================
  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Back online');
      setOfflineMode(false);
      syncAllLocalResumes();
      loadResumes(true);
    };

    const handleOffline = () => {
      console.log('📴 Offline mode activated');
      setOfflineMode(true);
      toast('You are offline. Changes will be saved locally.', { icon: '📴' });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ==================== SYNC ALL LOCAL RESUMES TO SERVER ====================
  const syncAllLocalResumes = useCallback(async () => {
    if (syncInProgress || offlineMode) return;

    const localResumes = JSON.parse(localStorage.getItem('local_resumes') || '[]');
    const unsyncedLocal = localResumes.filter(r => r._id?.startsWith('local_'));

    if (unsyncedLocal.length === 0) return;

    setSyncInProgress(true);
    console.log('🔄 Syncing local resumes to server...', unsyncedLocal.length);

    const toastId = toast.loading(`Syncing ${unsyncedLocal.length} local resume(s)...`);
    let syncedCount = 0;
    const failedResumes = [];

    for (const resume of unsyncedLocal) {
      const attempts = syncAttemptsRef.current[resume._id] || 0;
      if (attempts > 3) {
        console.warn('⚠️ Too many sync attempts for resume:', resume._id);
        failedResumes.push(resume);
        continue;
      }

      try {
        const resumeToSync = { ...resume };
        delete resumeToSync._id;
        delete resumeToSync.id;
        delete resumeToSync.offline;

        if (!resumeToSync.personalInfo) {
          resumeToSync.personalInfo = {};
        }

        const saved = await apiService.resume.createResume(resumeToSync);
        console.log(`✅ Synced ${resume._id} → ${saved._id}`);
        syncedCount++;

        delete syncAttemptsRef.current[resume._id];

        setResumes(prev => {
          const filtered = prev.filter(r => r._id !== resume._id);
          return [saved, ...filtered];
        });

        setCurrentResume(prev => {
          if (prev?._id === resume._id) {
            return saved;
          }
          return prev;
        });

      } catch (err) {
        console.warn(`⚠️ Sync failed for ${resume._id}:`, err.message);
        syncAttemptsRef.current[resume._id] = attempts + 1;
        failedResumes.push(resume);
      }
    }

    const remainingLocal = [
      ...failedResumes,
      ...localResumes.filter(r => !r._id?.startsWith('local_'))
    ];
    localStorage.setItem('local_resumes', JSON.stringify(remainingLocal));

    if (syncedCount > 0) {
      toast.success(`✅ Synced ${syncedCount} resume(s) to server!`, { id: toastId });
      await loadResumes(true);
    } else if (failedResumes.length > 0) {
      toast.error(`Failed to sync ${failedResumes.length} resume(s)`, { id: toastId });
    } else {
      toast.dismiss(toastId);
    }

    setSyncInProgress(false);
  }, [offlineMode, syncInProgress]);

  // ==================== LOAD ALL RESUMES ====================
  const loadResumes = useCallback(async (force = false) => {
    console.log('🔄 loadResumes called', { force, offlineMode });

    if (!force && resumes.length > 0 && !loading) {
      console.log('⏭️ Using cached resumes');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let loadedResumes = [];
      const localResumes = JSON.parse(localStorage.getItem('local_resumes') || '[]');

      if (!offlineMode) {
        try {
          const serverResumes = await apiService.resume.getUserResumes();
          console.log('✅ API resumes loaded:', serverResumes.length);

          const serverIds = new Set(serverResumes.map(r => r._id));
          const unsyncedLocal = localResumes.filter(r => !serverIds.has(r._id) && r._id?.startsWith('local_'));

          loadedResumes = [...serverResumes, ...unsyncedLocal];

          if (unsyncedLocal.length > 0) {
            toast(`${unsyncedLocal.length} local resume(s) waiting to sync`, { icon: '📦' });
          }
        } catch (apiError) {
          console.log('⚠️ API failed, using local only:', apiError);
          loadedResumes = localResumes;
        }
      } else {
        loadedResumes = localResumes;
        console.log('📦 Offline mode - local resumes:', loadedResumes.length);
      }

      setResumes(loadedResumes);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('❌ Fatal error in loadResumes:', err);
      setError(err.message);
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  }, [resumes.length, loading, offlineMode]);

  // ==================== LOAD SINGLE RESUME ====================
  const loadResume = useCallback(async (id) => {
    console.log('🔍 loadResume called with id:', id);

    if (!id || id === 'new' || id === 'new-resume') {
      console.log('📝 Creating empty resume for new');
      setCurrentResume(apiService.resume.getEmptyResume());
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let resume = null;

      const fromState = resumes.find(r => r._id === id || r.id === id);
      if (fromState) {
        console.log('💾 Loaded from state:', id);
        setCurrentResume(fromState);
        setLoading(false);
        return fromState;
      }

      const localResumes = JSON.parse(localStorage.getItem('local_resumes') || '[]');
      resume = localResumes.find(r => r._id === id || r.id === id);

      if (resume) {
        console.log('📦 Loaded from localStorage:', id);
        setCurrentResume(resume);

        setResumes(prev => {
          const exists = prev.some(r => r._id === id);
          if (!exists) {
            return [resume, ...prev];
          }
          return prev;
        });

        if (!offlineMode && id.startsWith('local_')) {
          const hasData = resume.personalInfo?.firstName ||
            resume.summary ||
            (resume.experience?.length > 0);

          if (hasData) {
            console.log('🔄 Local resume has data, will sync to server soon');
            setTimeout(() => {
              syncSingleResumeToServer(resume);
            }, 2000);
          }
        }

        setLoading(false);
        return resume;
      }

      if (!offlineMode && !id.startsWith('local_')) {
        try {
          resume = await apiService.resume.getResume(id);
          console.log('✅ Loaded from API:', id);

          setCurrentResume(resume);
          setResumes(prev => {
            const exists = prev.some(r => r._id === id);
            if (exists) {
              return prev.map(r => r._id === id ? resume : r);
            }
            return [resume, ...prev];
          });

          setLoading(false);
          return resume;

        } catch (apiError) {
          console.log('⚠️ API load failed:', apiError);

          if (apiError.response?.status === 404) {
            const possibleMatch = localResumes.find(r =>
              r.personalInfo?.email === 'sudipsherpa999@gmail.com' ||
              r.personalInfo?.firstName === 'sudipp'
            );

            if (possibleMatch) {
              console.log('🔍 Found match by content:', possibleMatch._id);
              toast.success('Found locally saved version');
              setCurrentResume(possibleMatch);
              setLoading(false);
              return possibleMatch;
            }
          }

          throw apiError;
        }
      }

      throw new Error('Resume not found');

    } catch (err) {
      console.error('❌ Load resume failed:', err);
      setError(err.message);
      toast.error('Failed to load resume');
      setLoading(false);
      throw err;
    }
  }, [resumes, offlineMode]);

  // ==================== SYNC SINGLE RESUME TO SERVER ====================
  const syncSingleResumeToServer = useCallback(async (localResume) => {
    if (!localResume || !localResume._id?.startsWith('local_') || offlineMode || syncInProgress) {
      return null;
    }

    const attempts = syncAttemptsRef.current[localResume._id] || 0;
    if (attempts > 3) {
      console.warn('⚠️ Too many sync attempts for:', localResume._id);
      return null;
    }

    console.log('🔄 Syncing local resume to server:', localResume._id);

    try {
      const resumeToSync = { ...localResume };
      delete resumeToSync._id;
      delete resumeToSync.id;
      delete resumeToSync.offline;

      if (!resumeToSync.personalInfo) {
        resumeToSync.personalInfo = {};
      }

      const saved = await apiService.resume.createResume(resumeToSync);
      console.log('✅ Synced to server, new ID:', saved._id);

      const localResumes = JSON.parse(localStorage.getItem('local_resumes') || '[]');
      const updatedLocal = localResumes.filter(r => r._id !== localResume._id);
      localStorage.setItem('local_resumes', JSON.stringify(updatedLocal));

      setResumes(prev => {
        const withoutOld = prev.filter(r => r._id !== localResume._id);
        return [saved, ...withoutOld];
      });

      if (currentResume?._id === localResume._id) {
        setCurrentResume(saved);

        toast.success((t) => (
          <div className="flex flex-col gap-2">
            <p className="font-medium">✨ Resume synced to server!</p>
            <button
              onClick={() => {
                window.location.href = `/builder/edit/${saved._id}`;
                toast.dismiss(t.id);
              }}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
            >
              Open Server Version
            </button>
          </div>
        ), { duration: 10000 });
      } else {
        toast.success('Local resume synced to server');
      }

      delete syncAttemptsRef.current[localResume._id];

      return saved;

    } catch (error) {
      console.error('❌ Sync failed:', error);
      syncAttemptsRef.current[localResume._id] = attempts + 1;

      toast.error((t) => (
        <div className="flex flex-col gap-2">
          <p>Failed to sync to server</p>
          <button
            onClick={() => {
              syncSingleResumeToServer(localResume);
              toast.dismiss(t.id);
            }}
            className="px-3 py-1.5 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 transition"
          >
            Retry Sync
          </button>
        </div>
      ), { duration: 8000 });

      return null;
    }
  }, [offlineMode, syncInProgress, currentResume]);

  // ==================== INITIALIZE ====================
  useEffect(() => {
    console.log('🚀 Initializing ResumeContext');
    loadResumes(true);

    return () => {
      console.log('🧹 Cleaning up ResumeContext');
      mountedRef.current = false;
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [loadResumes]);

  // ==================== CREATE RESUME ====================
  const createResume = useCallback(async (initialData = {}) => {
    setIsSaving(true);
    setError(null);

    try {
      let newResume;
      const empty = apiService.resume.getEmptyResume();

      if (!offlineMode) {
        try {
          newResume = await apiService.resume.createResume(initialData);
          console.log('✅ Created on server:', newResume._id);
          toast.success('Resume created!');
        } catch (apiError) {
          console.log('⚠️ API create failed, using local:', apiError);

          const localId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          newResume = {
            ...empty,
            ...initialData,
            _id: localId,
            id: localId,
            offline: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            analysis: { atsScore: 0 }
          };

          const localResumes = JSON.parse(localStorage.getItem('local_resumes') || '[]');
          localStorage.setItem('local_resumes', JSON.stringify([newResume, ...localResumes]));
          toast.success('Resume saved locally');
        }
      } else {
        const localId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        newResume = {
          ...empty,
          ...initialData,
          _id: localId,
          id: localId,
          offline: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          analysis: { atsScore: 0 }
        };

        const localResumes = JSON.parse(localStorage.getItem('local_resumes') || '[]');
        localStorage.setItem('local_resumes', JSON.stringify([newResume, ...localResumes]));
        toast.success('Resume saved locally');
      }

      setResumes(prev => [newResume, ...prev]);
      setCurrentResume(newResume);

      return newResume;
    } catch (err) {
      console.error('❌ Create failed:', err);
      setError(err.message);
      toast.error('Failed to create resume');
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [offlineMode]);

  // ==================== FIXED SAVE RESUME ====================
  const saveResume = useCallback(async (resumeData) => {
    if (!resumeData) {
      toast.error('No resume data to save');
      throw new Error('No resume data');
    }

    console.log('💾 saveResume called with:', {
      id: resumeData._id,
      summary: resumeData.summary,
      isLocal: resumeData._id?.startsWith('local_')
    });

    setIsSaving(true);
    setError(null);

    try {
      let savedResume;
      const isLocal = resumeData._id?.startsWith('local_');
      const updatedData = {
        ...resumeData,
        updatedAt: new Date().toISOString()
      };

      // Validate required fields before sending
      if (!updatedData.personalInfo) {
        updatedData.personalInfo = {};
      }
      if (!updatedData.analysis) {
        updatedData.analysis = { atsScore: 0 };
      }

      if (!offlineMode) {
        try {
          savedResume = await apiService.resume.updateResume(resumeData._id, updatedData);
          console.log('✅ Saved on server:', savedResume._id);
          toast.success('Resume saved!');
        } catch (apiError) {
          console.log('⚠️ API save failed, falling back to local:', apiError);

          // Show validation errors if present
          if (apiError.response?.data?.details) {
            const errors = apiError.response.data.details;
            errors.forEach(err => {
              toast.error(err.message || 'Validation error');
            });
          } else {
            // Fixed: changed toast.warning to toast()
            toast('Saved locally (server unavailable)', { icon: '📦' });
          }

          const localId = isLocal ? resumeData._id : `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          savedResume = {
            ...updatedData,
            _id: localId,
            id: localId,
            offline: true
          };
          const localResumes = JSON.parse(localStorage.getItem('local_resumes') || '[]');
          const index = localResumes.findIndex(r => r._id === localId);
          if (index >= 0) {
            localResumes[index] = savedResume;
          } else {
            localResumes.push(savedResume);
          }
          localStorage.setItem('local_resumes', JSON.stringify(localResumes));
        }
      } else {
        const localId = isLocal ? resumeData._id : `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        savedResume = {
          ...updatedData,
          _id: localId,
          id: localId,
          offline: true
        };
        const localResumes = JSON.parse(localStorage.getItem('local_resumes') || '[]');
        const index = localResumes.findIndex(r => r._id === localId);
        if (index >= 0) {
          localResumes[index] = savedResume;
        } else {
          localResumes.push(savedResume);
        }
        localStorage.setItem('local_resumes', JSON.stringify(localResumes));
        toast.success('Saved locally');
      }

      setResumes(prev => {
        const withoutOld = prev.filter(r => r._id !== resumeData._id);
        return [savedResume, ...withoutOld];
      });
      setCurrentResume(savedResume);

      return savedResume;
    } catch (err) {
      console.error('❌ Save failed:', err);
      setError(err.message);
      toast.error('Failed to save resume');
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [offlineMode]);

  // ==================== UPDATE CURRENT RESUME DATA ====================
  const updateCurrentResumeData = useCallback((updates) => {
    console.log('🔵 ResumeContext - updateCurrentResumeData called with:', updates);

    setCurrentResume(prev => {
      console.log('🔵 ResumeContext - Previous state:', prev?.summary);

      if (!prev) {
        const empty = apiService.resume.getEmptyResume();
        const localId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const updated = {
          ...empty,
          ...updates,
          personalInfo: updates.personalInfo ? { ...empty.personalInfo, ...updates.personalInfo } : empty.personalInfo,
          summary: updates.summary !== undefined ? updates.summary : empty.summary,
          experience: updates.experience ? (Array.isArray(updates.experience) ? updates.experience : updates.experience.items || empty.experience) : empty.experience,
          skills: updates.skills ? (Array.isArray(updates.skills) ? updates.skills : updates.skills.items || empty.skills) : empty.skills,
          education: updates.education ? (Array.isArray(updates.education) ? updates.education : updates.education.items || empty.education) : empty.education,
          projects: updates.projects ? (Array.isArray(updates.projects) ? updates.projects : updates.projects.items || empty.projects) : empty.projects,
          certifications: updates.certifications ? (Array.isArray(updates.certifications) ? updates.certifications : updates.certifications.items || empty.certifications) : empty.certifications,
          languages: updates.languages ? (Array.isArray(updates.languages) ? updates.languages : updates.languages.items || empty.languages) : empty.languages,
          _id: localId,
          id: localId,
          updatedAt: new Date().toISOString()
        };

        console.log('🔵 ResumeContext - Created new resume with summary:', updated.summary);

        const localResumes = JSON.parse(localStorage.getItem('local_resumes') || '[]');
        localStorage.setItem('local_resumes', JSON.stringify([updated, ...localResumes]));

        return updated;
      }

      let newSummary = prev.summary;
      if (updates.summary !== undefined) {
        if (typeof updates.summary === 'string') {
          newSummary = updates.summary;
          console.log('🔵 ResumeContext - Updating summary to:', newSummary);
        } else if (typeof updates.summary === 'object' && updates.summary !== null) {
          if (typeof updates.summary.summary === 'string') {
            newSummary = updates.summary.summary;
            console.log('🔵 ResumeContext - Updating summary from wrapped object to:', newSummary);
          } else {
            console.warn('🔴 ResumeContext - Invalid summary value received (object without summary property):', updates.summary);
          }
        } else {
          console.warn('🔴 ResumeContext - Invalid summary value received (not a string):', updates.summary);
        }
      }

      const updated = {
        ...prev,
        ...updates,
        summary: newSummary,
        personalInfo: updates.personalInfo ? { ...prev.personalInfo, ...updates.personalInfo } : prev.personalInfo,
        experience: updates.experience ? (Array.isArray(updates.experience) ? updates.experience : updates.experience.items || prev.experience) : prev.experience,
        skills: updates.skills ? (Array.isArray(updates.skills) ? updates.skills : updates.skills.items || prev.skills) : prev.skills,
        education: updates.education ? (Array.isArray(updates.education) ? updates.education : updates.education.items || prev.education) : prev.education,
        projects: updates.projects ? (Array.isArray(updates.projects) ? updates.projects : updates.projects.items || prev.projects) : prev.projects,
        certifications: updates.certifications ? (Array.isArray(updates.certifications) ? updates.certifications : updates.certifications.items || prev.certifications) : prev.certifications,
        languages: updates.languages ? (Array.isArray(updates.languages) ? updates.languages : updates.languages.items || prev.languages) : prev.languages,
        updatedAt: new Date().toISOString()
      };

      console.log('🔵 ResumeContext - Updated resume, new summary:', updated.summary);

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          console.log('⏰ Auto-saving resume with summary:', updated.summary);
          await saveResume(updated);
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }, 2000);

      return updated;
    });
  }, [saveResume]);

  // ==================== DELETE RESUME ====================
  const deleteResume = useCallback(async (id) => {
    if (!id) {
      toast.error('No resume selected');
      return;
    }

    try {
      setResumes(prev => prev.filter(r => r._id !== id && r.id !== id));
      if (currentResume?._id === id || currentResume?.id === id) {
        setCurrentResume(null);
      }

      const localResumes = JSON.parse(localStorage.getItem('local_resumes') || '[]');
      localStorage.setItem('local_resumes', JSON.stringify(
        localResumes.filter(r => r._id !== id && r.id !== id)
      ));

      if (!id.startsWith('local_') && !offlineMode) {
        try {
          await apiService.resume.deleteResume(id);
          toast.success('Resume deleted');
        } catch (apiError) {
          console.log('⚠️ API delete failed:', apiError);
          toast.success('Resume removed locally');
        }
      } else {
        toast.success('Resume deleted');
      }

      await loadResumes(true);

    } catch (err) {
      console.error('❌ Delete failed:', err);
      setError(err.message);
      toast.error('Failed to delete');
    }
  }, [currentResume, loadResumes, offlineMode]);

  // ==================== UTILITIES ====================
  const refreshResumes = useCallback(async () => {
    await loadResumes(true);
    toast.success('Resumes refreshed');
  }, [loadResumes]);

  const clearCurrentResume = useCallback(() => {
    setCurrentResume(null);
  }, []);

  const getResumeById = useCallback((id) => {
    return resumes.find(r => r._id === id || r.id === id);
  }, [resumes]);

  // ==================== VALUE ====================
  const value = useMemo(() => ({
    resumes,
    currentResume,
    loading,
    error,
    isSaving,
    syncInProgress,
    offlineMode,
    hasResumes: resumes.length > 0,
    hasCurrentResume: !!currentResume,
    lastUpdated,
    createResume,
    saveResume,
    deleteResume,
    loadResume,
    loadResumes,
    refreshResumes,
    updateCurrentResumeData,
    clearCurrentResume,
    getResumeById,
    getEmptyResume: apiService.resume.getEmptyResume,
    syncAllLocalResumes,
    syncSingleResumeToServer
  }), [
    resumes, currentResume, loading, error, isSaving, syncInProgress, offlineMode, lastUpdated,
    createResume, saveResume, deleteResume, loadResume, loadResumes,
    refreshResumes, updateCurrentResumeData, clearCurrentResume, getResumeById,
    syncAllLocalResumes, syncSingleResumeToServer
  ]);

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
};