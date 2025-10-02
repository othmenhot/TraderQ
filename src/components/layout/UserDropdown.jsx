import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { User, Settings, LogOut } from 'lucide-react';

const UserDropdown = () => {
    const { user, userProfile, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Failed to log out:", error);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getInitials = (name) => {
        if (!name) return 'G';
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
                {userProfile?.photoURL ? (
                    <img src={userProfile.photoURL} alt="Profile" className="w-full h-full rounded-full" />
                ) : (
                    <span>{getInitials(userProfile?.displayName)}</span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-card rounded-md shadow-lg py-1 ring-1 ring-border z-50">
                    <div className="px-4 py-2 border-b border-border">
                         <p className="text-sm font-medium text-foreground truncate">{userProfile?.displayName || 'Guest User'}</p>
                         <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                        <Link
                            to="/profile"
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-secondary"
                            onClick={() => setIsOpen(false)}
                        >
                           <User className="mr-2 h-4 w-4" />
                           Profile
                        </Link>
                        <Link
                            to="/settings"
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-secondary"
                            onClick={() => setIsOpen(false)}
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </Link>
                    </div>
                    <div className="py-1 border-t border-border">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;
