import { useState, useCallback } from 'react';

interface StreamingAIState {
  isLoading: boolean;
  content: string;
  error: string | null;
}

/**
 * Hook to consume Server-Sent Events (SSE) from the backend for streaming AI text.
 */
export const useStreamingAI = () => {
  const [state, setState] = useState<StreamingAIState>({
    isLoading: false,
    content: '',
    error: null,
  });

  const startStream = useCallback((jobId: string) => {
    setState({ isLoading: true, content: '', error: null });

    // The backend should expose an endpoint like GET /api/ai/stream/:jobId
    const eventSource = new EventSource(`/api/ai/stream/${jobId}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.done) {
          eventSource.close();
          setState((prev) => ({ ...prev, isLoading: false }));
          return;
        }

        if (data.chunk) {
          setState((prev) => ({
            ...prev,
            content: prev.content + data.chunk,
          }));
        }
      } catch (err) {
        console.error('Error parsing SSE data', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('EventSource failed:', err);
      eventSource.close();
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Connection to AI stream lost.',
      }));
    };

    // Cleanup function
    return () => {
      eventSource.close();
    };
  }, []);

  return { ...state, startStream };
};
