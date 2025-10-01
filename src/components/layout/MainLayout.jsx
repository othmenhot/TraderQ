import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <Outlet /> 
      </main>
    </div>
  );
};

export default MainLayout;
