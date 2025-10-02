import React from 'react';
import { Link } from 'react-router-dom';

const AppFooter = () => {
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Trader Quest. All Rights Reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/terms" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
