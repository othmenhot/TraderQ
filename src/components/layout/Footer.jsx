import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Github, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary/5 backdrop-blur-sm border-t border-border mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-6 md:space-y-0">
          
          {/* Logo and Copyright */}
          <div className="md:w-1/3">
            <Link to="/" className="text-xl font-bold text-foreground">
              Trader Quest
            </Link>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              Master the art of trading through a gamified learning journey.
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              © {new Date().getFullYear()} Trader Quest. All Rights Reserved.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-6">
            <Link to="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <Link to="/roadmap" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Roadmap
            </Link>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
              <Twitter size={20} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
              <Github size={20} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
              <Linkedin size={20} />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
