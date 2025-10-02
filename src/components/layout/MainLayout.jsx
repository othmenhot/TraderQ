import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        <Outlet /> 
      </main>
      {/* AppFooter removed */}
    </div>
  );
};

export default MainLayout;
