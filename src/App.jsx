import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import RoadmapPage from './pages/RoadmapPage';
// LearningPathDetailPage is no longer needed as the Roadmap is the main view
import ModuleDetailPage from './pages/ModuleDetailPage';
import ChapterPage from './pages/ChapterPage';
import ThemeToggle from './components/ui/ThemeToggle';

const HomePage = () => (
  <div className="text-center">
    <h1 className="text-4xl font-bold mb-4">Welcome to Trader Quest!</h1>
    <p className="text-xl text-muted-foreground">
      Your journey to mastering the art of trading starts here.
    </p>
    <div className="mt-8">
      <Link to="/register" className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-semibold">
        Get Started
      </Link>
    </div>
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
    <>
      <ThemeToggle />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            {/* The routes for modules and chapters now stem from the roadmap logic */}
            <Route path="/learn/:pathId/:moduleId" element={<ModuleDetailPage />} />
            <Route path="/learn/:pathId/:moduleId/:chapterId" element={<ChapterPage />} />
          </Route>
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
};

export default App;
