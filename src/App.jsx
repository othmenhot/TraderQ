import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from 'react-error-boundary';

// Layouts
import LandingLayout from './components/layout/LandingLayout';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import RoadmapPage from './pages/RoadmapPage';
import SimulatorPage from './pages/SimulatorPage';
import ModuleDetailPage from './pages/ModuleDetailPage';
import ChapterPage from './pages/ChapterPage';
import AdminPage from './pages/AdminPage';

// Simple fallback component for the error boundary
const ErrorFallback = ({ error }) => (
  <div role="alert" className="p-4">
    <p>Something went wrong:</p>
    <pre style={{ color: 'red' }}>{error.message}</pre>
  </div>
);

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        Loading application...
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Toaster position="bottom-right" />
      <Routes>
        {/* Public Routes */}
        <Route element={<LandingLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected App Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/simulator" element={<SimulatorPage />} />
            <Route path="/learn/:pathId/:moduleId" element={<ModuleDetailPage />} />
            <Route path="/learn/:pathId/:moduleId/:chapterId" element={<ChapterPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
