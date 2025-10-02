import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { X, Menu } from 'lucide-react'; // Using lucide-react icons

const LandingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-transparent backdrop-blur-sm sticky top-0 z-40">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-foreground">
          Trader Quest
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Features
          </Link>
          <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Pricing
          </Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login" className="text-sm font-medium text-foreground hover:text-accent">
            Login
          </Link>
          <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/register">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} aria-label="Open menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
            <Link to="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={toggleMenu}>
              Features
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={toggleMenu}>
              Pricing
            </Link>
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={toggleMenu}>
              Login
            </Link>
            <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 w-full" onClick={toggleMenu}>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;
