import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts & Pages
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import RoadmapPage from './pages/RoadmapPage';
import ModuleDetailPage from './pages/ModuleDetailPage';
import ChapterPage from './pages/ChapterPage';
import AdminPage from './pages/AdminPage';
import ThemeToggle from './components/ui/ThemeToggle';

const HomePage = () => (
  <div className="text-center">
    <h1 className="text-4xl font-bold mb-4">Welcome to Trader Quest!</h1>
    <p className="text-xl text-muted-foreground">
      Your journey to mastering the art of trading starts here.
    </p>
  </div>
);

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-background text-foreground flex items-center justify-center">Loading application...</div>;
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
            <Route path="/learn/:pathId/:moduleId" element={<ModuleDetailPage />} />
            <Route path="/learn/:pathId/:moduleId/:chapterId" element={<ChapterPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
};

export default App;
