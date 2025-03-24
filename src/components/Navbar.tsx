
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
        isScrolled 
          ? 'py-3 bg-white/80 backdrop-blur-md shadow-sm' 
          : 'py-5 bg-transparent'
      )}
    >
      <div className="container max-w-7xl container-padding">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-outfit font-semibold">ContentAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              <a href="#features" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                Pricing
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                How It Works
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/login" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                Login
              </Link>
              <Link to="/login" className="hero-btn primary-btn text-sm">
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile Navigation Toggle */}
          <button
            className="md:hidden text-foreground p-2 rounded-md focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[57px] bg-white z-40 animate-fade-in">
            <div className="flex flex-col space-y-4 p-6">
              <a 
                href="#features" 
                className="text-lg font-medium p-2 hover:bg-muted rounded-md transition-colors"
                onClick={toggleMobileMenu}
              >
                Features
              </a>
              <a 
                href="#pricing" 
                className="text-lg font-medium p-2 hover:bg-muted rounded-md transition-colors"
                onClick={toggleMobileMenu}
              >
                Pricing
              </a>
              <a 
                href="#how-it-works" 
                className="text-lg font-medium p-2 hover:bg-muted rounded-md transition-colors"
                onClick={toggleMobileMenu}
              >
                How It Works
              </a>
              <Link 
                to="/login" 
                className="text-lg font-medium p-2 hover:bg-muted rounded-md transition-colors"
                onClick={toggleMobileMenu}
              >
                Login
              </Link>
              <Link 
                to="/login" 
                className="primary-btn text-center" 
                onClick={toggleMobileMenu}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
