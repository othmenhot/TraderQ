import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // Optional: show a loading spinner or a blank page while checking auth state
    return <div>Loading...</div>;
  }

  if (!user) {
    // User is not authenticated, redirect to login page
    return <Navigate to="/login" />;
  }

  // User is authenticated, render the child route content
  return <Outlet />;
};

export default ProtectedRoute;
