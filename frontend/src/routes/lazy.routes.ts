import { lazy } from 'react';

// Route-based code splitting using React.lazy to reduce initial bundle size to < 180KB

export const BuilderPage = lazy(() => import('../pages/BuilderPage').catch(err => {
  console.error("Failed to load BuilderPage", err);
  return { default: () => <div>Error loading Builder</div> };
}));

export const DashboardPage = lazy(() => import('../pages/DashboardPage'));

export const TemplateMarketplace = lazy(() => import('../pages/TemplateMarketplace'));

export const AnalyticsDashboard = lazy(() => import('../pages/AnalyticsDashboard'));

// Helper hook for Suspense fallbacks
export const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600 font-medium">Loading Resumecraft...</span>
  </div>
);
