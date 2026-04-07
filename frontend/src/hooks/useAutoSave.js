// hooks/useAutoSave.js - AUTO-SAVE WITH BACKEND API INTEGRATION & LOCAL BACKUP
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook for debounced auto-saving with local backup
 */
const useAutoSave = ({ 
  data, 
  onSave, 
  delay = 2000, 
  enabled = true, 
  apiUrl = null,
  localKey = null 
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved'); // saved, saving, error
  const [lastSaved, setLastSaved] = useState(null);

  const timeoutRef = useRef(null);
  const prevDataRef = useRef(null);
  const isMountedRef = useRef(true);
  const onSaveRef = useRef(onSave);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const performSave = useCallback(async (dataToSave) => {
    if (!isMountedRef.current) return;

    try {
      setIsSaving(true);
      setSaveStatus('saving');

      // 1. Immediate Local Backup
      if (localKey) {
        localStorage.setItem(localKey, JSON.stringify(dataToSave));
      }

      // 2. Call custom onSave handler (usually the API sync)
      if (onSaveRef.current) {
        await onSaveRef.current(dataToSave);
      }

      // 3. Also call direct API if provided
      if (apiUrl) {
        const response = await fetch(apiUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(dataToSave)
        });

        if (!response.ok) {
          throw new Error(`API save failed: ${response.statusText}`);
        }
      }

      if (isMountedRef.current) {
        setLastSaved(new Date());
        setSaveStatus('saved');
      }
    } catch (error) {
      console.error('Auto-save error:', error);
      if (isMountedRef.current) {
        setSaveStatus('error');
      }
    } finally {
      if (isMountedRef.current) {
        setIsSaving(false);
      }
    }
  }, [apiUrl, localKey]);

  useEffect(() => {
    if (!enabled || !data) {
      return;
    }

    // Deep compare to avoid unnecessary saves
    const dataString = JSON.stringify(data);
    const dataChanged = dataString !== JSON.stringify(prevDataRef.current);

    if (dataChanged) {
      // Set status to unsaved/saving immediately to provide feedback
      setSaveStatus('saving');
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          performSave(data);
          prevDataRef.current = JSON.parse(dataString);
        }
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, enabled, delay, performSave]);

  const forceSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (data) {
      performSave(data);
      prevDataRef.current = JSON.parse(JSON.stringify(data));
    }
  }, [data, performSave]);

  return {
    isSaving,
    saveStatus,
    lastSaved,
    forceSave
  };
};

export default useAutoSave;
