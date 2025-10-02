import React from 'react';
import { Outlet } from 'react-router-dom';
import LandingHeader from './LandingHeader';
import Footer from './Footer';

const LandingLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default LandingLayout;
