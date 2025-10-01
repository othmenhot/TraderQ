import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <button 
      onClick={toggleTheme}
      className="fixed top-4 right-4 px-4 py-2 bg-primary text-primary-foreground rounded-md z-50"
    >
      Switch to {theme === 'light' ? 'Dark' : 'Light'}
    </button>
  );
};

export default ThemeToggle;
