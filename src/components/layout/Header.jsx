import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Menu, X, User, Settings, LogOut } from 'lucide-react';
import UserDropdown from './UserDropdown';

const Header = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinkClasses = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
    }`;

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b border-border">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-foreground">
          Trader Quest
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <NavLink to="/dashboard" className={navLinkClasses}>Dashboard</NavLink>
              <NavLink to="/roadmap" className={navLinkClasses}>Roadmap</NavLink>
              <NavLink to="/simulator" className={navLinkClasses}>Simulator</NavLink>
              <NavLink to="/admin" className={navLinkClasses}>Admin</NavLink>
              <UserDropdown />
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-sm font-medium text-foreground hover:text-accent">
                Login
              </Link>
              <Button asChild size="sm">
                <Link to="/register">Start for Free</Link>
              </Button>
            </div>
          )}
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
        <div className="md:hidden bg-background/95 backdrop-blur-sm border-t border-border">
          <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
            {user ? (
              <>
                <NavLink to="/dashboard" className={navLinkClasses} onClick={toggleMenu}>Dashboard</NavLink>
                <NavLink to="/roadmap" className={navLinkClasses} onClick={toggleMenu}>Roadmap</NavLink>
                <NavLink to="/simulator" className={navLinkClasses} onClick={toggleMenu}>Simulator</NavLink>
                <NavLink to="/admin" className={navLinkClasses} onClick={toggleMenu}>Admin</NavLink>
                <div className="border-t border-border pt-4 mt-4">
                  <UserDropdown />
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-foreground hover:text-accent" onClick={toggleMenu}>
                  Login
                </Link>
                <Button asChild size="sm" onClick={toggleMenu}>
                  <Link to="/register">Start for Free</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
