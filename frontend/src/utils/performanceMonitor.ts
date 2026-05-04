import { onCLS, onFID, onLCP, onTTFB, onFCP, Metric } from 'web-vitals';

/**
 * Utility to monitor Core Web Vitals and send them to the analytics backend.
 * Helps ensure we hit the Lighthouse 95+ and TTI < 1.2s targets.
 */
export const initPerformanceMonitor = () => {
  const sendToAnalytics = (metric: Metric) => {
    const body = JSON.stringify(metric);
    // Use navigator.sendBeacon if available, otherwise fallback to fetch
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/vitals', body);
    } else {
      fetch('/api/analytics/vitals', { body, method: 'POST', keepalive: true });
    }
    
    // Log in development
    if (import.meta.env.DEV) {
      console.log(`[Web Vitals] ${metric.name}: ${metric.value}`);
    }
  };

  // Cumulative Layout Shift
  onCLS(sendToAnalytics);
  // First Input Delay (related to TTI)
  onFID(sendToAnalytics);
  // Largest Contentful Paint
  onLCP(sendToAnalytics);
  // Time to First Byte
  onTTFB(sendToAnalytics);
  // First Contentful Paint
  onFCP(sendToAnalytics);
};
