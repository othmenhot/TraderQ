import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

const Header = () => {
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const navLinkClasses = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
    }`;

  return (
    <header className="bg-card shadow-md sticky top-0 z-40">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-2xl font-bold text-primary">
            Trader Quest
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/dashboard" className={navLinkClasses}>
              Dashboard
            </NavLink>
            <NavLink to="/roadmap" className={navLinkClasses}>
              Roadmap
            </NavLink>
            {/* Add a link to the admin page if user is logged in */}
            {user && (
              <NavLink to="/admin" className={navLinkClasses}>
                Admin
              </NavLink>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {userProfile && (
                <span className="text-sm font-semibold text-primary">
                  Level {userProfile.level}
                </span>
              )}
              <span className="text-sm text-muted-foreground hidden md:inline">{user.isAnonymous ? 'Guest' : user.email}</span>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-primary hover:underline">
                Login
              </Link>
              <Button asChild size="sm">
                <Link to="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
