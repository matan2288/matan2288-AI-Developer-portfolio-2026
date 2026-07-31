import React from 'react';
import { Menu, X, Edit3, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

interface NavItem {
  num: string;
  label: string;
  id: string;
  href: string;
}

interface NavbarContainerProps {
  portfolioName: string;
  navItems: NavItem[];
  activeSection: string;
  currentView: 'portfolio' | 'blog';
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  onOpenTinaAdmin: () => void;
  onSelectView: (view: 'portfolio' | 'blog') => void;
}

export const NavbarContainer: React.FC<NavbarContainerProps> = ({
  portfolioName,
  navItems,
  activeSection,
  currentView,
  isMenuOpen,
  setIsMenuOpen,
  onNavClick,
  onOpenTinaAdmin,
  onSelectView,
}) => {
  const firstName = portfolioName.split(' ')[0] || '';
  const restName = portfolioName.split(' ').slice(1).join(' ') || '';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border transition-all duration-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Name */}
        <a 
          href="#home" 
          onClick={(e) => {
            if (currentView === 'blog') {
              onSelectView('portfolio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              onNavClick(e, '#home');
            }
          }} 
          className="flex items-center gap-2"
        >
          <span className="text-sm font-bold tracking-tight text-text uppercase">
            {firstName}
            <span className="text-text-muted font-normal ml-1">
              {restName}
            </span>
          </span>
        </a>

        {/* Desktop inline navigation */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7">
          {navItems.map((item) => (
            <a
              key={item.num}
              href={item.href}
              onClick={(e) => onNavClick(e, item.href)}
              className={`relative text-xs tracking-tight py-1.5 transition-colors ${
                currentView === 'portfolio' && activeSection === item.num 
                  ? 'text-text font-semibold' 
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <span>{item.label}</span>
              {currentView === 'portfolio' && activeSection === item.num && (
                <motion.span 
                  layoutId="activeSectionUnderline" 
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-text rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}

          <span className="text-border text-xs font-light">|</span>

          {/* TinaCMS Admin Button */}
          <button
            onClick={onOpenTinaAdmin}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider bg-text text-white hover:bg-neutral-800 transition-all cursor-pointer font-bold shadow-2xs"
          >
            <Edit3 size={13} className="text-emerald-400" />
            <span>TinaCMS Admin</span>
          </button>

          {/* Blog Button */}
          <button
            onClick={() => {
              onSelectView('blog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              currentView === 'blog'
                ? 'bg-text text-white font-bold shadow-xs ring-1 ring-text'
                : 'bg-bg-alt border border-border text-text-muted hover:text-text hover:border-text'
            }`}
          >
            <BookOpen size={13} className={currentView === 'blog' ? 'text-white' : 'text-accent'} />
            <span>Blog</span>
          </button>
        </nav>

        {/* Mobile menu toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="md:hidden text-text p-1.5 hover:bg-neutral-100 rounded-lg focus:outline-none transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile collapsible dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-border py-6 px-6 space-y-4 shadow-lg max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                onOpenTinaAdmin();
                setIsMenuOpen(false);
              }}
              className="text-sm tracking-tight py-2.5 border-b border-neutral-100 flex items-center justify-between text-text font-bold"
            >
              <span className="flex items-center gap-2">
                <Edit3 size={16} className="text-emerald-500" />
                <span>TinaCMS Headless Studio</span>
              </span>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase font-bold">CMS</span>
            </button>

            <button
              onClick={() => {
                onSelectView('blog');
                setIsMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`text-sm tracking-tight py-2.5 border-b border-neutral-100 flex items-center justify-between transition-colors ${
                currentView === 'blog' ? 'text-text font-bold' : 'text-text-muted hover:text-text'
              }`}
            >
              <span className="flex items-center gap-2">
                <BookOpen size={16} className="text-accent" />
                <span>Engineering Blog</span>
              </span>
            </button>

            {navItems.map((item) => (
              <a
                key={item.num}
                href={item.href}
                onClick={(e) => onNavClick(e, item.href)}
                className={`text-sm tracking-tight py-2.5 border-b border-neutral-50 last:border-0 transition-colors block ${
                  currentView === 'portfolio' && activeSection === item.num 
                    ? 'text-text font-bold border-b border-text' 
                    : 'text-text-muted hover:text-text'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
